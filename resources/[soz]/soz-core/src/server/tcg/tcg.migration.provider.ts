import * as fs from 'fs';
import * as path from 'path';

import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { PrismaService } from '../database/prisma.service';

// Chemin vers le dossier des images TCG sur le serveur de jeu
// À adapter si le chemin est différent sur ton environnement
const TCG_ASSETS_DIR = path.resolve(__dirname, '../../../../../citizen/static/game/images/phone/tcg');
const TCG_IMAGE_BASE_URL = 'http://localhost:8080/static/game/images/phone/tcg';

@Provider()
export class TcgMigrationProvider {
    @Inject(PrismaService)
    private readonly prismaService: PrismaService;

    @Once(OnceStep.DatabaseConnected)
    async migrate(): Promise<void> {
        await this.migrateContactMessage();
        await this.syncCards();
    }

    // ---- Migration : colonne message sur tcg_contact ----

    private async migrateContactMessage(): Promise<void> {
        const columns = await this.prismaService.$queryRaw<{ Field: string }[]>`
            SHOW COLUMNS FROM tcg_contact LIKE 'message'
        `;

        if (columns.length === 0) {
            await this.prismaService.$executeRaw`
                ALTER TABLE tcg_contact ADD COLUMN message VARCHAR(50) NULL
            `;
            console.log('[TCG Migration] Colonne message ajoutée à tcg_contact');
        }
    }

    // ---- Sync cartes depuis les assets ----

    private async syncCards(): Promise<void> {
        if (!fs.existsSync(TCG_ASSETS_DIR)) {
            console.warn(`[TCG Migration] Dossier assets introuvable : ${TCG_ASSETS_DIR}`);
            return;
        }

        // Lister tous les .webp du dossier
        const files = fs.readdirSync(TCG_ASSETS_DIR).filter(f => f.endsWith('.webp'));

        if (files.length === 0) {
            console.warn('[TCG Migration] Aucun fichier .webp trouvé dans les assets TCG');
            return;
        }

        // Récupérer les images déjà en base
        const existingCards = await this.prismaService.tcg_card.findMany({
            select: { image: true },
        });
        const existingImages = new Set(existingCards.map(c => c.image));

        // Construire la liste des nouvelles cartes à insérer
        const newCards: { name: string; image: string }[] = [];

        for (const file of files) {
            const imageUrl = `${TCG_IMAGE_BASE_URL}/${file}`;
            if (existingImages.has(imageUrl)) continue;

            // Dériver le nom depuis le nom de fichier
            // ex: "10088_00001_.webp" → "10088 00001"
            const name = file
                .replace('.webp', '')
                .replace(/_/g, ' ')
                .trim();

            newCards.push({ name, image: imageUrl });
        }

        if (newCards.length === 0) {
            console.log('[TCG Migration] Cartes à jour, aucune nouvelle carte à insérer');
            return;
        }

        await this.prismaService.tcg_card.createMany({
            data: newCards.map(c => ({ name: c.name, image: c.image, active: true })),
            skipDuplicates: true,
        });

        console.log(`[TCG Migration] ${newCards.length} nouvelle(s) carte(s) insérée(s)`);
    }
}
import * as fs from 'fs';
import * as path from 'path';

import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { PrismaService } from '../database/prisma.service';

// Chemin vers le dossier des images TCG
// Résolu dynamiquement : remonte depuis resources/[soz]/soz-core/ jusqu'à la racine du serveur,
// puis cherche SOZ-FiveM-Assets au même niveau que SOZ-FiveM-Server
const SERVER_ROOT = path.resolve(GetResourcePath(GetCurrentResourceName()), '../../..');
const TCG_ASSETS_DIR = path.resolve(SERVER_ROOT, '..', 'SOZ-FiveM-Assets/static/game/images/phone/tcg');
const TCG_IMAGE_BASE_PATH = 'images/phone/tcg';

@Provider()
export class TcgMigrationProvider {
    @Inject(PrismaService)
    private readonly prismaService: PrismaService;

    @Once(OnceStep.DatabaseConnected)
    async migrate(): Promise<void> {
        await this.createTablesIfNeeded();
        await this.migrateContactMessage();
        await this.migratePhoneProfile();
        await this.syncCards();
    }

    // ---- Création automatique des tables TCG si absentes ----

    private async createTablesIfNeeded(): Promise<void> {
        const tables = await this.prismaService.$queryRaw<{ table_name: string }[]>`
            SELECT TABLE_NAME as table_name FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME LIKE 'tcg_%'
        `;
        const existing = new Set(tables.map(t => t.table_name));

        // 1. tcg_card (parent, doit exister en premier)
        if (!existing.has('tcg_card')) {
            await this.prismaService.$executeRawUnsafe(`
                CREATE TABLE tcg_card (
                    id INT NOT NULL AUTO_INCREMENT,
                    name VARCHAR(128) NOT NULL,
                    image VARCHAR(512) NOT NULL,
                    prompt TEXT NULL,
                    active BOOLEAN NOT NULL DEFAULT true,
                    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                    PRIMARY KEY (id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('[TCG Migration] Table tcg_card créée');
        }

        // 2. tcg_user_card
        if (!existing.has('tcg_user_card')) {
            await this.prismaService.$executeRawUnsafe(`
                CREATE TABLE tcg_user_card (
                    id INT NOT NULL AUTO_INCREMENT,
                    citizenid VARCHAR(50) NOT NULL,
                    card_id INT NOT NULL,
                    obtained_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                    PRIMARY KEY (id),
                    UNIQUE KEY tcg_user_card_card_id_key (card_id),
                    INDEX tcg_user_card_citizenid_idx (citizenid),
                    CONSTRAINT tcg_user_card_card_id_fkey FOREIGN KEY (card_id) REFERENCES tcg_card (id) ON DELETE RESTRICT ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('[TCG Migration] Table tcg_user_card créée');
        }

        // 3. tcg_daily_claim
        if (!existing.has('tcg_daily_claim')) {
            await this.prismaService.$executeRawUnsafe(`
                CREATE TABLE tcg_daily_claim (
                    id INT NOT NULL AUTO_INCREMENT,
                    citizenid VARCHAR(50) NOT NULL,
                    claim_date VARCHAR(10) NOT NULL,
                    claimed_count INT NOT NULL DEFAULT 0,
                    PRIMARY KEY (id),
                    UNIQUE KEY tcg_daily_claim_citizenid_claim_date_key (citizenid, claim_date)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('[TCG Migration] Table tcg_daily_claim créée');
        }

        // 4. tcg_wallpaper
        if (!existing.has('tcg_wallpaper')) {
            await this.prismaService.$executeRawUnsafe(`
                CREATE TABLE tcg_wallpaper (
                    citizenid VARCHAR(50) NOT NULL,
                    card_id INT NOT NULL,
                    PRIMARY KEY (citizenid),
                    CONSTRAINT tcg_wallpaper_card_id_fkey FOREIGN KEY (card_id) REFERENCES tcg_card (id) ON DELETE CASCADE ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('[TCG Migration] Table tcg_wallpaper créée');
        }

        // 5. tcg_contact
        if (!existing.has('tcg_contact')) {
            await this.prismaService.$executeRawUnsafe(`
                CREATE TABLE tcg_contact (
                    id INT NOT NULL AUTO_INCREMENT,
                    citizenid VARCHAR(50) NOT NULL,
                    target_id VARCHAR(50) NOT NULL,
                    status VARCHAR(20) NOT NULL DEFAULT 'pending',
                    message VARCHAR(50) NULL,
                    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
                    PRIMARY KEY (id),
                    UNIQUE KEY tcg_contact_citizenid_target_id_key (citizenid, target_id),
                    INDEX tcg_contact_target_id_idx (target_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('[TCG Migration] Table tcg_contact créée');
        }

        // 6. tcg_profile
        if (!existing.has('tcg_profile')) {
            await this.prismaService.$executeRawUnsafe(`
                CREATE TABLE tcg_profile (
                    citizenid VARCHAR(50) NOT NULL,
                    username VARCHAR(20) NOT NULL,
                    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                    PRIMARY KEY (citizenid),
                    UNIQUE KEY tcg_profile_username_key (username)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('[TCG Migration] Table tcg_profile créée');
        }

        // 7. tcg_trade_request
        if (!existing.has('tcg_trade_request')) {
            await this.prismaService.$executeRawUnsafe(`
                CREATE TABLE tcg_trade_request (
                    id INT NOT NULL AUTO_INCREMENT,
                    sender_id VARCHAR(50) NOT NULL,
                    receiver_id VARCHAR(50) NOT NULL,
                    requested_card_id INT NOT NULL,
                    offer_type VARCHAR(10) NOT NULL DEFAULT 'money',
                    offer_card_id INT NULL,
                    offer_amount INT NULL DEFAULT 0,
                    status VARCHAR(20) NOT NULL DEFAULT 'pending',
                    message TEXT NULL,
                    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
                    PRIMARY KEY (id),
                    INDEX tcg_trade_request_receiver_id_idx (receiver_id),
                    INDEX tcg_trade_request_sender_id_idx (sender_id),
                    CONSTRAINT tcg_trade_request_requested_card_id_fkey FOREIGN KEY (requested_card_id) REFERENCES tcg_card (id) ON DELETE CASCADE ON UPDATE CASCADE,
                    CONSTRAINT tcg_trade_request_offer_card_id_fkey FOREIGN KEY (offer_card_id) REFERENCES tcg_card (id) ON DELETE SET NULL ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('[TCG Migration] Table tcg_trade_request créée');
        }

        // 8. tcg_showcase
        if (!existing.has('tcg_showcase')) {
            await this.prismaService.$executeRawUnsafe(`
                CREATE TABLE tcg_showcase (
                    id INT NOT NULL AUTO_INCREMENT,
                    citizenid VARCHAR(50) NOT NULL,
                    card_id INT NOT NULL,
                    description VARCHAR(30) NOT NULL DEFAULT '',
                    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                    PRIMARY KEY (id),
                    UNIQUE KEY tcg_showcase_card_id_key (card_id),
                    INDEX tcg_showcase_citizenid_idx (citizenid),
                    CONSTRAINT tcg_showcase_card_id_fkey FOREIGN KEY (card_id) REFERENCES tcg_card (id) ON DELETE CASCADE ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('[TCG Migration] Table tcg_showcase créée');
        }
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

    // ---- Migration : profil SMS TCG ----

    private async migratePhoneProfile(): Promise<void> {
        const existing = await this.prismaService.$queryRaw<{ number: string }[]>`
            SELECT number FROM phone_profile WHERE number = '555-TCG'
        `;

        if (existing.length === 0) {
            await this.prismaService.$executeRaw`
                INSERT INTO phone_profile (number, avatar) VALUES ('555-TCG', 'images/society/tcg.webp')
            `;
            console.log('[TCG Migration] Profil SMS 555-TCG créé');
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
            const imageUrl = `${TCG_IMAGE_BASE_PATH}/${file}`;
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
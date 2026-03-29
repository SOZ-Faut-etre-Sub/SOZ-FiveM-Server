import * as fs from 'fs';
import * as path from 'path';

import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { PrismaService } from '../database/prisma.service';

// Chemin vers le dossier des images TCG
const SERVER_ROOT = path.resolve(GetResourcePath(GetCurrentResourceName()), '../../..');
const TCG_ROOT_DIR = path.resolve(SERVER_ROOT, '..', 'SOZ-FiveM-Assets/static/game/images/phone/apps/tcg');
const TCG_ASSETS_DIR = path.resolve(TCG_ROOT_DIR, 'cards');
const TCG_IMAGE_BASE_PATH = 'images/phone/apps/tcg/cards';
const TCG_BORDERS_DIR = path.resolve(TCG_ROOT_DIR, 'borders');
const TCG_BORDERS_BASE_PATH = 'images/phone/apps/tcg/borders';
const TCG_BADGES_DIR = path.resolve(TCG_ROOT_DIR, 'badges');
const TCG_BADGES_BASE_PATH = 'images/phone/apps/tcg/badges';

@Provider()
export class TcgMigrationProvider {
    @Inject(PrismaService)
    private readonly prismaService: PrismaService;

    @Once(OnceStep.DatabaseConnected)
    async migrate(): Promise<void> {
        await this.createTablesIfNeeded();
        await this.migrateContactMessage();
        await this.migratePhoneProfile();
        await this.migrateArchetypeColumn();
        await this.migrateProtectedColumn();
        await this.migrateProfileStats();
        await this.migrateProfileBio();
        await this.migrateProfileAvatar();
        await this.syncCards();
        await this.syncBorders();
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
                    archetype VARCHAR(50) NULL,
                    active BOOLEAN NOT NULL DEFAULT true,
                    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                    PRIMARY KEY (id),
                    INDEX tcg_card_archetype_idx (archetype)
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
                    protected BOOLEAN NOT NULL DEFAULT false,
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

        // 9. tcg_trade_partner (unique trade partners for badge anti-farm)
        if (!existing.has('tcg_trade_partner')) {
            await this.prismaService.$executeRawUnsafe(`
                CREATE TABLE tcg_trade_partner (
                    id INT NOT NULL AUTO_INCREMENT,
                    citizenid VARCHAR(50) NOT NULL,
                    partner_id VARCHAR(50) NOT NULL,
                    first_trade_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                    PRIMARY KEY (id),
                    UNIQUE KEY tcg_trade_partner_unique (citizenid, partner_id),
                    INDEX tcg_trade_partner_citizenid_idx (citizenid)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('[TCG Migration] Table tcg_trade_partner créée');
        }

        // 10. tcg_border (profile frame borders)
        if (!existing.has('tcg_border')) {
            await this.prismaService.$executeRawUnsafe(`
                CREATE TABLE tcg_border (
                    id INT NOT NULL AUTO_INCREMENT,
                    name VARCHAR(100) NOT NULL,
                    image VARCHAR(255) NOT NULL,
                    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                    PRIMARY KEY (id),
                    UNIQUE KEY tcg_border_name_key (name)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('[TCG Migration] Table tcg_border créée');
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

    // ---- Migration : colonne archetype sur tcg_card ----

    private async migrateArchetypeColumn(): Promise<void> {
        const columns = await this.prismaService.$queryRaw<{ Field: string }[]>`
            SHOW COLUMNS FROM tcg_card LIKE 'archetype'
        `;

        if (columns.length === 0) {
            await this.prismaService.$executeRawUnsafe(`
                ALTER TABLE tcg_card ADD COLUMN archetype VARCHAR(50) NULL,
                ADD INDEX tcg_card_archetype_idx (archetype)
            `);
            console.log('[TCG Migration] Colonne archetype ajoutée à tcg_card');

            // Tagger les cartes existantes depuis le CSV
            await this.applyTagsFromCsv();
        }
    }

    // ---- Migration : colonne protected sur tcg_user_card ----

    private async migrateProtectedColumn(): Promise<void> {
        const columns = await this.prismaService.$queryRaw<{ Field: string }[]>`
            SHOW COLUMNS FROM tcg_user_card LIKE 'protected'
        `;

        if (columns.length === 0) {
            await this.prismaService.$executeRaw`
                ALTER TABLE tcg_user_card ADD COLUMN \`protected\` BOOLEAN NOT NULL DEFAULT false
            `;
            console.log('[TCG Migration] Colonne protected ajoutée à tcg_user_card');
        }
    }

    // ---- Migration : compteurs stats sur tcg_profile ----

    private async migrateProfileStats(): Promise<void> {
        const columns = await this.prismaService.$queryRaw<{ Field: string }[]>`
            SHOW COLUMNS FROM tcg_profile LIKE 'total_cards_obtained'
        `;

        if (columns.length === 0) {
            await this.prismaService.$executeRawUnsafe(`
                ALTER TABLE tcg_profile
                    ADD COLUMN total_cards_obtained INT NOT NULL DEFAULT 0,
                    ADD COLUMN total_cards_obtained_classic INT NOT NULL DEFAULT 0,
                    ADD COLUMN total_cards_obtained_cute INT NOT NULL DEFAULT 0,
                    ADD COLUMN total_cards_obtained_event INT NOT NULL DEFAULT 0,
                    ADD COLUMN total_trades_completed INT NOT NULL DEFAULT 0,
                    ADD COLUMN total_sets_sold INT NOT NULL DEFAULT 0,
                    ADD COLUMN total_sets_sold_classic INT NOT NULL DEFAULT 0,
                    ADD COLUMN total_sets_sold_cute INT NOT NULL DEFAULT 0,
                    ADD COLUMN total_sets_sold_event INT NOT NULL DEFAULT 0
            `);
            console.log('[TCG Migration] Compteurs stats ajoutés à tcg_profile');

            // Backfill: count existing cards per player (total only, category breakdown not possible retroactively)
            await this.prismaService.$executeRawUnsafe(`
                UPDATE tcg_profile p
                SET p.total_cards_obtained = (
                    SELECT COUNT(*) FROM tcg_user_card uc WHERE uc.citizenid = p.citizenid
                )
            `);

            // Backfill: count existing accepted trades per player
            await this.prismaService.$executeRawUnsafe(`
                UPDATE tcg_profile p
                SET p.total_trades_completed = (
                    SELECT COUNT(*) FROM tcg_trade_request tr
                    WHERE (tr.sender_id = p.citizenid OR tr.receiver_id = p.citizenid)
                    AND tr.status = 'accepted'
                )
            `);

            // Backfill: populate trade partners from existing accepted trades
            await this.prismaService.$executeRawUnsafe(`
                INSERT IGNORE INTO tcg_trade_partner (citizenid, partner_id, first_trade_at)
                SELECT tr.sender_id, tr.receiver_id, MIN(tr.created_at)
                FROM tcg_trade_request tr
                WHERE tr.status = 'accepted'
                GROUP BY tr.sender_id, tr.receiver_id
            `);
            await this.prismaService.$executeRawUnsafe(`
                INSERT IGNORE INTO tcg_trade_partner (citizenid, partner_id, first_trade_at)
                SELECT tr.receiver_id, tr.sender_id, MIN(tr.created_at)
                FROM tcg_trade_request tr
                WHERE tr.status = 'accepted'
                GROUP BY tr.receiver_id, tr.sender_id
            `);

            console.log('[TCG Migration] Compteurs stats backfillés');
        }

        // Migration pour les colonnes catégorisées (si elles n'existent pas encore)
        const catColumns = await this.prismaService.$queryRaw<{ Field: string }[]>`
            SHOW COLUMNS FROM tcg_profile LIKE 'total_cards_obtained_classic'
        `;
        if (catColumns.length === 0) {
            await this.prismaService.$executeRawUnsafe(`
                ALTER TABLE tcg_profile
                    ADD COLUMN total_cards_obtained_classic INT NOT NULL DEFAULT 0,
                    ADD COLUMN total_cards_obtained_cute INT NOT NULL DEFAULT 0,
                    ADD COLUMN total_cards_obtained_event INT NOT NULL DEFAULT 0,
                    ADD COLUMN total_sets_sold_classic INT NOT NULL DEFAULT 0,
                    ADD COLUMN total_sets_sold_cute INT NOT NULL DEFAULT 0,
                    ADD COLUMN total_sets_sold_event INT NOT NULL DEFAULT 0
            `);
            console.log('[TCG Migration] Compteurs catégorisés ajoutés à tcg_profile');
        }
    }

    // ---- Migration : colonne bio sur tcg_profile ----

    private async migrateProfileBio(): Promise<void> {
        const columns = await this.prismaService.$queryRaw<{ Field: string }[]>`
            SHOW COLUMNS FROM tcg_profile LIKE 'bio'
        `;

        if (columns.length === 0) {
            await this.prismaService.$executeRaw`
                ALTER TABLE tcg_profile ADD COLUMN bio VARCHAR(50) NULL
            `;
            console.log('[TCG Migration] Colonne bio ajoutée à tcg_profile');
        }
    }

    // ---- Migration : colonnes avatar et border_id sur tcg_profile ----

    private async migrateProfileAvatar(): Promise<void> {
        const columns = await this.prismaService.$queryRaw<{ Field: string }[]>`
            SHOW COLUMNS FROM tcg_profile LIKE 'avatar'
        `;

        if (columns.length === 0) {
            await this.prismaService.$executeRawUnsafe(`
                ALTER TABLE tcg_profile
                    ADD COLUMN avatar TEXT NULL,
                    ADD COLUMN border_id INT NULL
            `);
            console.log('[TCG Migration] Colonnes avatar et border_id ajoutées à tcg_profile');
        }
    }

    // ---- Lecture du tags.csv ----

    private loadTagsCsv(): Map<string, string> {
        const csvPath = path.join(TCG_ROOT_DIR, 'tags.csv');
        const map = new Map<string, string>();

        if (!fs.existsSync(csvPath)) {
            console.warn(`[TCG Migration] tags.csv introuvable : ${csvPath}`);
            return map;
        }

        const content = fs.readFileSync(csvPath, 'utf-8');
        const lines = content.split('\n').map(l => l.trim().replace(/\r$/, ''));

        // Skip header
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line) continue;
            const sepIndex = line.indexOf(';');
            if (sepIndex === -1) continue;
            const filename = line.substring(0, sepIndex).trim();
            const archetype = line.substring(sepIndex + 1).trim();
            if (filename && archetype) {
                map.set(filename, archetype);
            }
        }

        console.log(`[TCG Migration] tags.csv chargé : ${map.size} entrées`);
        return map;
    }

    // ---- Appliquer les tags aux cartes existantes (migration initiale) ----

    private async applyTagsFromCsv(): Promise<void> {
        const tags = this.loadTagsCsv();
        if (tags.size === 0) return;

        const cards = await this.prismaService.tcg_card.findMany({
            where: { archetype: null },
            select: { id: true, image: true },
        });

        let updated = 0;
        for (const card of cards) {
            const filename = card.image.split('/').pop() ?? '';
            const archetype = tags.get(filename);
            if (archetype) {
                await this.prismaService.tcg_card.update({
                    where: { id: card.id },
                    data: { archetype },
                });
                updated++;
            }
        }

        if (updated > 0) {
            console.log(`[TCG Migration] ${updated} carte(s) existante(s) taguées depuis tags.csv`);
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

        // Charger les tags
        const tags = this.loadTagsCsv();

        // Récupérer les images déjà en base
        const existingCards = await this.prismaService.tcg_card.findMany({
            select: { image: true },
        });
        const existingImages = new Set(existingCards.map(c => c.image));

        // Construire la liste des nouvelles cartes à insérer
        const newCards: { name: string; image: string; archetype: string | null }[] = [];

        for (const file of files) {
            const imageUrl = `${TCG_IMAGE_BASE_PATH}/${file}`;
            if (existingImages.has(imageUrl)) continue;

            const name = file
                .replace('.webp', '')
                .replace(/_/g, ' ')
                .trim();

            const archetype = tags.get(file) ?? null;
            newCards.push({ name, image: imageUrl, archetype });
        }

        if (newCards.length === 0) {
            console.log('[TCG Migration] Cartes à jour, aucune nouvelle carte à insérer');
            return;
        }

        await this.prismaService.tcg_card.createMany({
            data: newCards.map(c => ({ name: c.name, image: c.image, archetype: c.archetype, active: true })),
            skipDuplicates: true,
        });

        const withTag = newCards.filter(c => c.archetype).length;
        const withoutTag = newCards.length - withTag;
        console.log(`[TCG Migration] ${newCards.length} nouvelle(s) carte(s) insérée(s) (${withTag} taguées, ${withoutTag} sans tag)`);
    }

    // ---- Sync borders depuis les assets ----

    private async syncBorders(): Promise<void> {
        if (!fs.existsSync(TCG_BORDERS_DIR)) {
            console.log(`[TCG Migration] Dossier borders introuvable (ignoré) : ${TCG_BORDERS_DIR}`);
            return;
        }

        const files = fs.readdirSync(TCG_BORDERS_DIR).filter(f => f.endsWith('.webp') || f.endsWith('.png'));

        if (files.length === 0) {
            console.log('[TCG Migration] Aucune bordure trouvée dans les assets');
            return;
        }

        const existingBorders = await this.prismaService.tcg_border.findMany({
            select: { name: true },
        });
        const existingNames = new Set(existingBorders.map(b => b.name));

        const newBorders: { name: string; image: string }[] = [];
        for (const file of files) {
            const name = file.replace(/\.(webp|png)$/, '').replace(/_/g, ' ').trim();
            if (existingNames.has(name)) continue;
            newBorders.push({ name, image: `${TCG_BORDERS_BASE_PATH}/${file}` });
        }

        if (newBorders.length === 0) {
            console.log('[TCG Migration] Bordures à jour, aucune nouvelle bordure');
            return;
        }

        await this.prismaService.tcg_border.createMany({
            data: newBorders,
            skipDuplicates: true,
        });

        console.log(`[TCG Migration] ${newBorders.length} nouvelle(s) bordure(s) insérée(s)`);
    }

    // ---- Helper statique : récupère le chemin d'image d'un badge ----

    static getBadgeImagePath(badgeId: string): string | null {
        if (!fs.existsSync(TCG_BADGES_DIR)) return null;
        const webp = path.join(TCG_BADGES_DIR, `${badgeId}.webp`);
        const png = path.join(TCG_BADGES_DIR, `${badgeId}.png`);
        if (fs.existsSync(webp)) return `${TCG_BADGES_BASE_PATH}/${badgeId}.webp`;
        if (fs.existsSync(png)) return `${TCG_BADGES_BASE_PATH}/${badgeId}.png`;
        return null;
    }
}
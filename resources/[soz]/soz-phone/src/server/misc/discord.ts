import axios, { AxiosResponse } from 'axios';

import { MarketplaceListing } from '../../../typings/marketplace';
import { mainLogger } from '../sv_logger';

const IMAGE_DELIMITER = '||!||';
const discordLogger = mainLogger.child({ module: 'discord' });

const DISCORD_WEBHOOK = GetConvar('NPWD_DISCORD_TOKEN', '');
/**
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure
 */
interface DiscordEmbedField {
    name: string;
    value: string;
    inline?: boolean;
}

interface DiscordEmbed {
    title: string;
    color: number;
    description: string;
    timestamp: string;
    fields: DiscordEmbedField[];
}

interface DiscordMessage {
    username: string;
    embeds: DiscordEmbed[];
}

const postToWebhook = async (content: DiscordMessage): Promise<AxiosResponse | void> => {
    // If convar isnt set
    if (!DISCORD_WEBHOOK) {
        discordLogger.warn(
            'Got a request to report a listing but discord is not configures. See README on how to configure discord endpoints.'
        );
        return;
    }
    const resp = await axios.post(DISCORD_WEBHOOK, { ...content });
    // If we get a bad request throw error
    if (resp.status < 200 && resp.status >= 300)
        throw new Error(`Discord Error: ${resp.status} Error - ${resp.statusText}`);
};

const createDiscordMsgObj = (type: string, message: string, fields: DiscordEmbedField[]) => {
    // Get ISO 8601 as its required by Discord API
    const curTime = new Date().toISOString();

    return {
        username: 'NPWD Report',
        embeds: [
            {
                title: `${type} REPORT`,
                color: 0xe74c3c,
                description: message,
                timestamp: curTime,
                fields,
            },
        ],
    };
};

export async function reportListingToDiscord(listing: MarketplaceListing, reportingProfile: string): Promise<any> {
    const guaranteedFields = [
        {
            name: 'Reported By',
            value: `\`\`\`Profile Name: ${reportingProfile}\`\`\``,
        },
        {
            name: 'Reported User Data',
            value: `\`\`\`Profile Name: ${listing.username}\nProfile ID: ${listing.id}\nUser Identifier: ${listing.identifier}\`\`\``,
        },
        {
            name: 'Reported Listing Title',
            value: `\`\`\`Title: ${listing.name}\`\`\``,
        },
        {
            name: 'Reported Listing Desc.',
            value: `\`\`\`Description: ${listing.description}\`\`\``,
        },
    ];

    const finalFields = listing.url
        ? guaranteedFields.concat({
              name: 'Reported Image:',
              value: listing.url.split(IMAGE_DELIMITER).join('\n'),
          })
        : guaranteedFields;

    const msgObj = createDiscordMsgObj('MARKETPLACE', `Received a report for a listing`, finalFields);
    try {
        await postToWebhook(msgObj);
    } catch (e) {
        discordLogger.error(e.message);
    }
}

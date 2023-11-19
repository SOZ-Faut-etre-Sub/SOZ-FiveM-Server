export type SenateParty = {
    id: string;
    name: string;
};

export type SenatePartyMember = {
    id: string;
    partyId: string;
    citizenId: string;
    senateSeatMember: null | number;
};

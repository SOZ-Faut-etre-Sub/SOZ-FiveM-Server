import { config } from '../server';

export const getPlayerGameLicense = (src: number): null | string => {
  // Parse specifically for license identifier as its
  // guaranteed
  const playerIdentifiers = getPlayerIdentifiers(src.toString());

  let playerIdentifier;
  for (const identifier of playerIdentifiers) {
    if (identifier.includes(config.database.identifierType + ':')) {
      if (config.database.useIdentifierPrefix) playerIdentifier = identifier;
      else playerIdentifier = identifier.split(':')[1];
    }
  }

  if (!playerIdentifier) return null;
  return playerIdentifier;
};

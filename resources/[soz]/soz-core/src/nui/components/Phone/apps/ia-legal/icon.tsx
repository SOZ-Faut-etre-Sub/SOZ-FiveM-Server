// =============================================================================
// src/nui/components/Phone/apps/ia-legal/icon.tsx
// Icône de l'app — utilise AppIcon avec le nom 'ia-legal'
// NOTE : Tu devras placer les images d'icône dans :
//   assets/images/phone/apps/ia-legal/logo-dark.webp
//   assets/images/phone/apps/ia-legal/logo-light.webp
// =============================================================================

import React from 'react';

import { AppIcon } from '../../components/system/AppIcon';

const IaLegalIcon: React.FC = props => {
    return <AppIcon {...props} name="ia-legal" />;
};

export default IaLegalIcon;

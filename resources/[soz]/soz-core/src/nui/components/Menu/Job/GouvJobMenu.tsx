import { usePlayer } from '@public/nui/hook/data';
import { GouvJobMenuPropData } from '@public/shared/job/gouv';
import { FunctionComponent } from 'react';

import { TaxLabel, TaxType } from '../../../../shared/bank';
import { NuiEvent } from '../../../../shared/event';
import { JobPermission, JobType } from '../../../../shared/job';
import { MenuType } from '../../../../shared/nui/menu';
import { RepositoryType } from '../../../../shared/repository';
import { fetchNui } from '../../../fetch';
import { useHasJobPermission } from '../../../hook/job';
import { useConfigurationValue, useRepository } from '../../../hook/repository';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuItemText,
    MenuTitle,
    SubMenu,
} from '../../Styleguide/Menu';

type GouvJobMenuProps = {
    data: GouvJobMenuPropData;
};

export const TAX_DESCRIPTION_ITEMS: Record<TaxType, string[]> = {
    [TaxType.HOUSING]: ["Achat d'une habitation.", "Amélioration d'une habitation.", 'Achat de meubles.'],
    [TaxType.VEHICLE]: [
        'Achat de véhicule aux concessionnaires classique, luxe, bateau, hélicoptère, moto et entreprise.',
        'Amélioration des véhicules au LS Custom.',
        'Utilisation du lavomatique.',
        'Passage des permis de conduire.',
    ],
    [TaxType.GREEN]: ['Achat de véhicule au concessionnaire électrique.'],
    [TaxType.FOOD]: ['Achat dans les superettes.'],
    [TaxType.WEAPON]: ["Achat à l'armurerie.", "Modification d'arme à l'armurerie."],
    [TaxType.SUPPLY]: ['Achat de vêtements.', 'Achat chez le tatoueur.', 'Achat chez le coiffeur.'],
    [TaxType.TRAVEL]: ["Achat d'un déplacement de véhicule entre Cayo Perico et San Andreas."],
    [TaxType.SERVICE]: [
        "Achat auprès du médecin d'urgence.",
        "Achat auprès du réparateur d'urgence.",
        "Achat d'un abonnement sportif à Muscle Peach.",
    ],
};

export const GouvJobMenu: FunctionComponent<GouvJobMenuProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_gouv';
    const taxData = useRepository(RepositoryType.Tax);
    const taxAllowed = useHasJobPermission(JobType.Gouv, JobPermission.GouvUpdateTax);
    const fineAllowed = useHasJobPermission(JobType.Gouv, JobPermission.GouvManageFine);
    const tier = useConfigurationValue('JobTaxTier');
    const gouv = useConfigurationValue('Gouv');
    const player = usePlayer();

    if (!player.job.onduty) {
        return (
            <Menu type={MenuType.GouvJobMenu}>
                <MainMenu>
                    <MenuTitle banner={banner}></MenuTitle>
                    <MenuContent>
                        <MenuItemText>Vous n'êtes pas en service.</MenuItemText>
                    </MenuContent>
                </MainMenu>
            </Menu>
        );
    }

    return (
        <Menu type={MenuType.GouvJobMenu}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.GouvAnnoncement);
                        }}
                    >
                        Faire une communication
                    </MenuItemButton>
                    {taxAllowed && <MenuItemSubMenuLink id="tax">Taxes</MenuItemSubMenuLink>}
                    {taxAllowed && <MenuItemSubMenuLink id="tier">Seuils d'impôts</MenuItemSubMenuLink>}
                    {fineAllowed && <MenuItemSubMenuLink id="fine">Amendes</MenuItemSubMenuLink>}
                    <MenuItemCheckbox
                        checked={data.displayRadar}
                        onChange={async value => {
                            await fetchNui(NuiEvent.ToggleRadar, value);
                        }}
                    >
                        Afficher les radars sur le GPS
                    </MenuItemCheckbox>
                    {data.updateSenatSalary && (
                        <MenuItemButton
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.GouvSenatSalary, gouv.SenatSalary);
                            }}
                        >
                            <div className="pr-2 flex items-center justify-between">
                                <span>Salaire de Sénateurs</span>
                                <span>{gouv.SenatSalary}$</span>
                            </div>
                        </MenuItemButton>
                    )}
                </MenuContent>
            </MainMenu>
            <SubMenu id="tax">
                <MenuTitle banner={banner}>Les taxes</MenuTitle>
                <MenuContent>
                    {Object.values(TaxType).map(taxType => {
                        const tax = taxData[taxType] ?? { id: taxType, value: 11 };

                        return (
                            <MenuItemButton
                                key={tax.id}
                                onConfirm={() => {
                                    fetchNui(NuiEvent.GouvSetTax, {
                                        type: tax.id,
                                    });
                                }}
                                description={
                                    <div className="text-sm">
                                        <h5 className="underline  decoration-solid">
                                            Cette taxe regroupe les services suivant :{' '}
                                        </h5>
                                        <ul className="pl-7 list-disc">
                                            {TAX_DESCRIPTION_ITEMS[tax.id].map((description, index) => (
                                                <li key={index}>{description}</li>
                                            ))}
                                        </ul>
                                    </div>
                                }
                            >
                                <span className="font-bold">{TaxLabel[tax.id]}</span>: {tax.value}%
                            </MenuItemButton>
                        );
                    })}
                </MenuContent>
            </SubMenu>
            <SubMenu id="tier">
                <MenuTitle banner={banner}>Seuil des Impôts</MenuTitle>
                <MenuContent>
                    <MenuItemSelect
                        onConfirm={(_, value) => {
                            if (value === 'amount') {
                                fetchNui(NuiEvent.GouvSetJobTaxTier, {
                                    tier: 'Tier1',
                                });
                            }

                            if (value === 'percentage') {
                                fetchNui(NuiEvent.GouvSetJobTaxTierPercentage, {
                                    tier: 'Tier1Percentage',
                                });
                            }
                        }}
                        description={`En dessous de ${Intl.NumberFormat('fr-FR').format(tier.Tier1)}$, ${
                            tier.Tier1Percentage
                        }%`}
                        title="Tier 1"
                    >
                        <MenuItemSelectOption value="amount">Modifier montant</MenuItemSelectOption>
                        <MenuItemSelectOption value="percentage">Modifier pourcentage</MenuItemSelectOption>
                    </MenuItemSelect>
                    <MenuItemSelect
                        onConfirm={(_, value) => {
                            if (value === 'amount') {
                                fetchNui(NuiEvent.GouvSetJobTaxTier, {
                                    tier: 'Tier2',
                                });
                            }

                            if (value === 'percentage') {
                                fetchNui(NuiEvent.GouvSetJobTaxTierPercentage, {
                                    tier: 'Tier2Percentage',
                                });
                            }
                        }}
                        description={`Entre ${Intl.NumberFormat('fr-FR').format(
                            tier.Tier1 + 1
                        )}$ et ${Intl.NumberFormat('fr-FR').format(tier.Tier2)}$, ${tier.Tier2Percentage}%`}
                        title="Tier 2"
                    >
                        <MenuItemSelectOption value="amount">Modifier montant</MenuItemSelectOption>
                        <MenuItemSelectOption value="percentage">Modifier pourcentage</MenuItemSelectOption>
                    </MenuItemSelect>
                    <MenuItemSelect
                        onConfirm={(_, value) => {
                            if (value === 'amount') {
                                fetchNui(NuiEvent.GouvSetJobTaxTier, {
                                    tier: 'Tier3',
                                });
                            }

                            if (value === 'percentage') {
                                fetchNui(NuiEvent.GouvSetJobTaxTierPercentage, {
                                    tier: 'Tier3Percentage',
                                });
                            }
                        }}
                        description={`Entre ${Intl.NumberFormat('fr-FR').format(
                            tier.Tier2 + 1
                        )}$ et ${Intl.NumberFormat('fr-FR').format(tier.Tier3)}$, ${tier.Tier3Percentage}%`}
                        title="Tier 3"
                    >
                        <MenuItemSelectOption value="amount">Modifier montant</MenuItemSelectOption>
                        <MenuItemSelectOption value="percentage">Modifier pourcentage</MenuItemSelectOption>
                    </MenuItemSelect>
                    <MenuItemSelect
                        onConfirm={(_, value) => {
                            if (value === 'amount') {
                                fetchNui(NuiEvent.GouvSetJobTaxTier, {
                                    tier: 'Tier4',
                                });
                            }

                            if (value === 'percentage') {
                                fetchNui(NuiEvent.GouvSetJobTaxTierPercentage, {
                                    tier: 'Tier4Percentage',
                                });
                            }
                        }}
                        description={`Entre ${Intl.NumberFormat('fr-FR').format(
                            tier.Tier3 + 1
                        )}$ et ${Intl.NumberFormat('fr-FR').format(tier.Tier4)}$, ${tier.Tier4Percentage}%`}
                        title="Tier 4"
                    >
                        <MenuItemSelectOption value="amount">Modifier montant</MenuItemSelectOption>
                        <MenuItemSelectOption value="percentage">Modifier pourcentage</MenuItemSelectOption>
                    </MenuItemSelect>
                    <MenuItemSelect
                        onConfirm={(_, value) => {
                            if (value === 'percentage') {
                                fetchNui(NuiEvent.GouvSetJobTaxTierPercentage, {
                                    tier: 'Tier5Percentage',
                                });
                            }
                        }}
                        description={`Au dessus de ${Intl.NumberFormat('fr-FR').format(tier.Tier4)}$, ${
                            tier.Tier5Percentage
                        }%`}
                        title="Tier 5"
                    >
                        <MenuItemSelectOption value="percentage">Modifier pourcentage</MenuItemSelectOption>
                    </MenuItemSelect>
                </MenuContent>
            </SubMenu>
            <SubMenu id="fine">
                <MenuTitle banner={banner}>Amendes</MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id="fine_1">🟢 Catégorie 1</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="fine_2">🟡 Catégorie 2</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="fine_3">🟠 Catégorie 3</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="fine_4">🔴 Catégorie 4</MenuItemSubMenuLink>
                </MenuContent>
            </SubMenu>
            <FineSubMenu category={1} />
            <FineSubMenu category={2} />
            <FineSubMenu category={3} />
            <FineSubMenu category={4} />
        </Menu>
    );
};

type FineSubMenuProps = {
    category: number;
};

const FineSubMenu: FunctionComponent<FineSubMenuProps> = ({ category }) => {
    const fines = useRepository(RepositoryType.Fine);
    const finesForCategory = Object.values(fines).filter(fine => fine.category === category);

    return (
        <SubMenu id={`fine_${category}`}>
            <MenuTitle banner="https://nui-img/soz/menu_job_gouv">Amendes categorie {category}</MenuTitle>
            <MenuContent>
                <MenuItemButton
                    onConfirm={() => {
                        fetchNui(NuiEvent.GouvFineAdd, {
                            category,
                        });
                    }}
                >
                    Ajouter une amende
                </MenuItemButton>
                {finesForCategory.map(fine => (
                    <MenuItemSelect
                        key={fine.id}
                        title={fine.label}
                        description={fine.label}
                        onConfirm={(i, value) => {
                            if (value === 'label') {
                                fetchNui(NuiEvent.GouvFineSetLabel, {
                                    id: fine.id,
                                });
                            }

                            if (value === 'min') {
                                fetchNui(NuiEvent.GouvFineSetMinPrice, {
                                    id: fine.id,
                                });
                            }

                            if (value === 'max') {
                                fetchNui(NuiEvent.GouvFineSetMaxPrice, {
                                    id: fine.id,
                                });
                            }

                            if (value === 'delete') {
                                fetchNui(NuiEvent.GouvFineRemove, {
                                    id: fine.id,
                                });
                            }
                        }}
                    >
                        <MenuItemSelectOption value="label">Changer le label</MenuItemSelectOption>
                        <MenuItemSelectOption value="min">Prix min: ${fine.price.min}</MenuItemSelectOption>
                        <MenuItemSelectOption value="max">Prix max: ${fine.price.max}</MenuItemSelectOption>
                        <MenuItemSelectOption value="delete">Supprimer</MenuItemSelectOption>
                    </MenuItemSelect>
                ))}
            </MenuContent>
        </SubMenu>
    );
};

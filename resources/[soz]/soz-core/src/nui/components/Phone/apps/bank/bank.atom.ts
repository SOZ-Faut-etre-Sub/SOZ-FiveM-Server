import { atom, useAtomValue } from 'jotai';
import { useSetAtom } from 'jotai';

import { BankContact, BankStatement, Invoice } from '../../../../../shared/bank';
import { useNuiEvent } from '../../../../hook/nui';
import { useInjectDebugData } from '../../system/debug/hooks/useInjectDebugData';

const accountIdAtom = atom<string>();
const balanceAtom = atom<number>(0);

const statementsAtom = atom<BankStatement[]>([]);
const homeStatementAtom = atom<BankStatement[]>(get => {
    return (
        get(statementsAtom)
            ?.sort((a, b) => b.date - a.date)
            ?.slice(0, 5) ?? []
    );
});

const invoicesAtom = atom<Invoice[]>([]);

const contactAtom = atom<BankContact[]>([]);

export const useAccountId = () => useAtomValue(accountIdAtom);
export const useBalance = () => useAtomValue(balanceAtom);

export const useStatements = () => useAtomValue(statementsAtom);
export const useHomeStatements = () => useAtomValue(homeStatementAtom);

export const useInvoices = () => useAtomValue(invoicesAtom);

export const useContacts = () => useAtomValue(contactAtom);

export const useAppBankStateHandlers = () => {
    const accountId = useAccountId();
    const setAccountId = useSetAtom(accountIdAtom);

    const setBalance = useSetAtom(balanceAtom);
    const setStatements = useSetAtom(statementsAtom);
    const setContacts = useSetAtom(contactAtom);
    const setInvoices = useSetAtom(invoicesAtom);

    useNuiEvent('phone', 'AppBankSetData', data => {
        setAccountId(data.account);
        setBalance(data.balance);
    });

    useNuiEvent('phone', 'AppBankSetInvoices', setInvoices);

    useNuiEvent('phone', 'AppBankSetStatements', setStatements);
    useNuiEvent('phone', 'AppBankAddStatement', (statement: BankStatement) => setStatements(s => [statement, ...s]));

    useNuiEvent('phone', 'AppBankSetContacts', setContacts);
    useNuiEvent('phone', 'AppBankAddContact', (contact: BankContact) => setContacts(c => [contact, ...c]));
    useNuiEvent('phone', 'AppBankRemoveContact', (id: number) =>
        setContacts(c => c.filter(contact => contact.id !== id))
    );

    useInjectDebugData(() => {
        setBalance(1000);

        const statements: BankStatement[] = [];

        for (let i = 0; i < 20; i++) {
            const isIncome = Math.random() > 0.5;

            statements.push({
                id: i,
                date: Date.now() - i * 1000 * 60 * 60 * 24,
                reason: `Test transaction ${i}`,
                amount: Math.random() * 1000,
                source_accountid: isIncome ? '1' : accountId,
                source_label: isIncome ? 'Test Source' : 'Test Target',
                target_accountid: isIncome ? accountId : '1',
                target_label: isIncome ? 'Test Target' : 'Test Source',
            });
        }

        setStatements(statements);

        setInvoices([
            {
                id: 1,
                emitter: 'Test Emitter',
                emitterName: 'Test Emitter',
                emitterSafe: 'Test Emitter',
                targetAccount: 'Test Target',
                label: 'Test Label',
                amount: 100,
                payed: false,
                refused: false,
                createdAt: Date.now(),
                citizenid: '',
                kind: '',
            },
            {
                id: 1,
                emitter: 'Test Emitter',
                emitterName: 'Test Emitter',
                emitterSafe: 'Test Emitter',
                targetAccount: 'Test Target',
                label: 'Test Label',
                amount: 100,
                payed: false,
                refused: false,
                createdAt: Date.now(),
                citizenid: '',
                kind: '',
            },
            {
                id: 1,
                emitter: 'Test Emitter',
                emitterName: 'Test Emitter',
                emitterSafe: 'Test Emitter',
                targetAccount: 'Test Target',
                label: 'Test Label',
                amount: 100,
                payed: false,
                refused: false,
                createdAt: Date.now(),
                citizenid: '',
                kind: '',
            },
            {
                id: 1,
                emitter: 'Test Emitter',
                emitterName: 'Test Emitter',
                emitterSafe: 'Test Emitter',
                targetAccount: 'Test Target',
                label: 'Test Label',
                amount: 100,
                payed: false,
                refused: false,
                createdAt: Date.now(),
                citizenid: '',
                kind: '',
            },
            {
                id: 1,
                emitter: 'Test Emitter',
                emitterName: 'Test Emitter',
                emitterSafe: 'Test Emitter',
                targetAccount: 'Test Target',
                label: 'Test Label',
                amount: 100,
                payed: false,
                refused: false,
                createdAt: Date.now(),
                citizenid: '',
                kind: '',
            },
            {
                id: 1,
                emitter: 'Test Emitter',
                emitterName: 'Test Emitter',
                emitterSafe: 'Test Emitter',
                targetAccount: 'Test Target',
                label: 'Test Label',
                amount: 100,
                payed: false,
                refused: false,
                createdAt: Date.now(),
                citizenid: '',
                kind: '',
            },
            {
                id: 1,
                emitter: 'Test Emitter',
                emitterName: 'Test Emitter',
                emitterSafe: 'Test Emitter',
                targetAccount: 'Test Target',
                label: 'Test Label',
                amount: 100,
                payed: false,
                refused: false,
                createdAt: Date.now(),
                citizenid: '',
                kind: '',
            },
            {
                id: 1,
                emitter: 'Test Emitter',
                emitterName: 'Test Emitter',
                emitterSafe: 'Test Emitter',
                targetAccount: 'Test Target',
                label: 'Test Label',
                amount: 100,
                payed: false,
                refused: false,
                createdAt: Date.now(),
                citizenid: '',
                kind: '',
            },
            {
                id: 1,
                emitter: 'Test Emitter',
                emitterName: 'Test Emitter',
                emitterSafe: 'Test Emitter',
                targetAccount: 'Test Target',
                label: 'Test Label',
                amount: 100,
                payed: false,
                refused: false,
                createdAt: Date.now(),
                citizenid: '',
                kind: '',
            },
            {
                id: 1,
                emitter: 'Test Emitter',
                emitterName: 'Test Emitter',
                emitterSafe: 'Test Emitter',
                targetAccount: 'Test Target',
                label: 'Test Label',
                amount: 100,
                payed: false,
                refused: false,
                createdAt: Date.now(),
                citizenid: '',
                kind: '',
            },
            {
                id: 1,
                emitter: 'Test Emitter',
                emitterName: 'Test Emitter',
                emitterSafe: 'Test Emitter',
                targetAccount: 'Test Target',
                label: 'Test Label',
                amount: 100,
                payed: false,
                refused: false,
                createdAt: Date.now(),
                citizenid: '',
                kind: '',
            },
            {
                id: 1,
                emitter: 'Test Emitter',
                emitterName: 'Test Emitter',
                emitterSafe: 'Test Emitter',
                targetAccount: 'Test Target',
                label: 'Test Label',
                amount: 100,
                payed: false,
                refused: false,
                createdAt: Date.now(),
                citizenid: '',
                kind: '',
            },
            {
                id: 1,
                emitter: 'Test Emitter',
                emitterName: 'Test Emitter',
                emitterSafe: 'Test Emitter',
                targetAccount: 'Test Target',
                label: 'Test Label',
                amount: 100,
                payed: false,
                refused: false,
                createdAt: Date.now(),
                citizenid: '',
                kind: '',
            },
            {
                id: 1,
                emitter: 'Test Emitter',
                emitterName: 'Test Emitter',
                emitterSafe: 'Test Emitter',
                targetAccount: 'Test Target',
                label: 'Test Label',
                amount: 100,
                payed: false,
                refused: false,
                createdAt: Date.now(),
                citizenid: '',
                kind: '',
            },
        ]);
    });
};

export interface BankStatementItem {
    id: number;
    date: number;
    source_accountid: string;
    source_label?: string;
    target_accountid: string;
    target_label?: string;
    reason: string;
    amount: number;
}

export enum BankStatementsEvents {
    FETCH_LAST_STATEMENTS = 'phone:app:bank-statements:getStatements',
    NEW_STATEMENT = 'phone:app:bank-statements:newStatement',
}

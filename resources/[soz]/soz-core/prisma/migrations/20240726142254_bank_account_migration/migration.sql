-- UpdateColumn
alter table bank_accounts
    modify account_type enum ('player', 'housestorages', 'business', 'safestorages', 'offshore', 'bank-atm', 'gang') default 'player' not null;

-- Migration
update `bank_accounts`
set accountid=businessid
where account_type in ('business', 'safestorages', 'offshore', 'bank-atm')
  and `businessid` is not null;

update `bank_accounts`
set accountid=houseid,
    account_type='housestorages'
where account_type in ('safestorages')
  and `houseid` is not null;

update `bank_accounts`
set accountid=gangid
where account_type in ('gang')
  and `gangid` is not null;

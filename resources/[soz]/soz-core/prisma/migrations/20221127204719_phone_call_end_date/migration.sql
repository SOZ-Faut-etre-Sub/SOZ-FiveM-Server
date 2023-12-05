alter table `phone_calls` alter column `end` set default current_timestamp();

update `phone_calls` set `end`=`start` where `end`='0000-00-00 00:00:00'

import { Inject, Injectable } from '../../../core/decorators/injectable';
import { ClickhouseService } from '../clickhouse.service';
import { ClickhouseMigration } from './migration.interface';

@Injectable('ClickhouseMigration')
export class MigrationTraceEvent implements ClickhouseMigration {
    @Inject(ClickhouseService)
    private clickhouseService: ClickhouseService;

    async migrate(): Promise<void> {
        await this.clickhouseService.exec({
            query: `
                CREATE TABLE IF NOT EXISTS trace_events
                (
                    event LowCardinality(String),
                    citizen_id String,
                    timestamp DateTime64,
                    player_name Nullable(String),
                    player_job LowCardinality(Nullable(String)),
                    player_on_duty Nullable(Boolean),
                    target_citizen_id Nullable(String),
                    target_name Nullable(String),
                    target_job LowCardinality(Nullable(String)),
                    target_on_duty Nullable(Boolean),
                    position Point,
                    z Nullable(Float64),
                    heading Nullable(Float64),
                    amount Nullable(Int64),
                    vehicle_plate Nullable(String),
                    vehicle_model LowCardinality(Nullable(String)),
                    vehicle_name Nullable(String),
                    vehicle_condition Nullable(String),
                    vehicle_pounds Nullable(String),
                    vehicle_destroyed Nullable(String),
                    vehicle_life_count_before Nullable(Int64),
                    vehicle_life_count_after Nullable(Int64),
                    vehicle_state Nullable(Int64),
                    vehicle_player Nullable(Boolean),
                    vehicle_id Nullable(Int64),
                    vehicle_net_id Nullable(Int64),
                    vehicle_attached_net_id Nullable(Int64),
                    vehicle_previous_owner_id Nullable(String),
                    vehicle_previous_owner_name Nullable(String),
                    garage_id Nullable(String),
                    garage_type LowCardinality(Nullable(String)),
                    money Nullable(Int64),
                    money_marked Nullable(Int64),
                    item_id Nullable(String),
                    item_count Nullable(Int64),
                    item_label Nullable(String),
                    type Nullable(String),
                    category LowCardinality(Nullable(String)),
                    house_id Nullable(String),
                    tier Nullable(Int64),
                    repair_type Nullable(String),
                    field Nullable(String),
                    id Nullable(String),
                    reason Nullable(String),
                    plaster_location Nullable(String),
                    plaster_remove Nullable(Boolean),
                    station_id Nullable(Int64),
                    station_type LowCardinality(Nullable(String)),
                    account_type LowCardinality(Nullable(String)),
                    collection_name Nullable(String),
                    source_account Nullable(String),
                    target_account Nullable(String),
                    percentage Nullable(Float64),
                    zone_id Nullable(String),
                    end_date Nullable(DateTime64),
                    citizen_ids Array(String),
                    prop_model Nullable(String),
                    prop_id Nullable(String),
                    collection_persist Nullable(Boolean),
                    collection_new_name Nullable(String),
                    collection_old_name Nullable(String),
                    collection_load Nullable(Boolean),
                    inventory_id Nullable(String),
                    inventory_source_id Nullable(String),
                    inventory_target_id Nullable(String),
                    inventory_source_owner Nullable(String),
                    inventory_target_owner Nullable(String),
                    tax_type Nullable(String),
                    cart_items Array(Tuple(item_id String, amount Int64)),
                    buy_type Nullable(String),
                    weather Nullable(String),
                    weather_temperature Nullable(Float64),
                    report_citizen_id Nullable(String),
                    report_type Nullable(String),
                    report_position Point,
                    reputation Nullable(Int64),
                    missive_type Nullable(Int64),
                    missive_choice1 Nullable(Int64),
                    missive_choice2 Nullable(Int64),
                    missive_choice3 Nullable(Int64),
                    missive_id Nullable(String),
                    injuries_date Nullable(Int64),
                    injuries_count Nullable(Int64),
                    talent Nullable(Int64),
                    criminal_state Nullable(Int64),
                    wash_in Nullable(Int64),
                    wash_out Nullable(Int64),
                    drug_type Nullable(String),
                    drug_skill Nullable(Int64),
                    drug_maturation Nullable(Int64),
                    flash_type Nullable(String),
                    message Nullable(String),
                    race_id Nullable(Int64),
                    race_name Nullable(String),
                    race_time Nullable(Int64),
                    duration Nullable(Int64),
                    before_health Nullable(Int64),
                    invoice_kind Nullable(String),
                    invoice_job Nullable(String),
                    title Nullable(String),
                    money_type Nullable(String),
                    vandalism_type Nullable(String),
                    vandalism_status Nullable(String),
                    vandalism_item_used_count Nullable(Int64),
                    vandalism_step Nullable(Int64),
                    racket_phase Nullable(String),
                    death_hunger_or_thirst Nullable(Boolean),
                    death_weapon Nullable(String),
                    death_ejection Nullable(Boolean),
                    death_frozen Nullable(Boolean),
                    shop_id Nullable(String),
                    jackpot Nullable(Boolean)
                )
                ENGINE = MergeTree()
                PRIMARY KEY (event)
                ORDER BY (event, timestamp)
                PARTITION BY (event, toYYYYMM(timestamp))
            `,
        });
    }

    get name(): string {
        return 'add_trace_event_table';
    }

    get priority(): number {
        return 0;
    }
}

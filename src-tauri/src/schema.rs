// @generated automatically by Diesel CLI.

diesel::table! {
    time_entries (id) {
        id -> Integer,
        user_id -> Integer,
        task_name -> Text,
        note -> Nullable<Text>,
        start_time -> Timestamp,
        end_time -> Timestamp,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    users (id) {
        id -> Integer,
        email -> Text,
        name -> Text,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::joinable!(time_entries -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    time_entries,
    users,
);

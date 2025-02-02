use diesel::prelude::*;

#[derive(Queryable, Identifiable, Debug)]
#[table_name = "users"]
pub struct User {
    pub id: i32,
    pub email: String,
    pub name: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Insertable)]
#[table_name = "users"]
pub struct NewUser<'a> {
    pub email: &'a str,
    pub name: &'a str,
}

#[derive(Queryable, Associations, Identifiable, Debug)]
#[belongs_to(User)]
#[table_name = "time_entries"]
pub struct TimeEntry {
    pub id: i32,
    pub user_id: i32,
    pub task_name: String,
    pub note: Option<String>,
    pub start_time: String,
    pub end_time: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Insertable)]
#[table_name = "time_entries"]
pub struct NewTimeEntry<'a> {
    pub user_id: i32,
    pub task_name: &'a str,
    pub note: Option<&'a str>,
    pub start_time: String,
    pub end_time: String,
}

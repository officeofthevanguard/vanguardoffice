import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabase = createClient(
  "https://dxdrdkctziebwbzuzebo.supabase.co",
  "sb_publishable_32D6r1k4UNURxUUwBIasRw_ZG_3yweV"
)

const { data, error } = await supabase
  .from("posts")
  .select("*")

console.log(data, error)

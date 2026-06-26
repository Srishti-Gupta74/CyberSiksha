const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function test() {
  console.log("Testing Supabase connection...");
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*');
  console.log("Profiles:", profiles?.length, pErr ? pErr.message : "OK");
  if (profiles) console.log(profiles);

  const { data: groups, error: gErr } = await supabase.from('family_groups').select('*');
  console.log("Groups:", groups?.length, gErr ? gErr.message : "OK");
  if (groups) console.log(groups);

  const { data: members, error: mErr } = await supabase.from('family_members').select('*');
  console.log("Members:", members?.length, mErr ? mErr.message : "OK");
  if (members) console.log(members);
}

test();

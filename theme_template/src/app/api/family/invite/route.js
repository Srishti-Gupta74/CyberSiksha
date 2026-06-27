import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getRequiredEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';

  return {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceRoleKey,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      familyGroupId,
      familyGroupName,
      inviteCode,
      inviteEmail,
      inviteName,
      inviteRelation,
      inviterName,
    } = body || {};

    if (!familyGroupId || !inviteCode || !inviteEmail) {
      return NextResponse.json({ error: 'Missing family group or invite details.' }, { status: 400 });
    }

    const authHeader = request.headers.get('authorization') || '';
    const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!accessToken) {
      return NextResponse.json({ error: 'Missing authorization token.' }, { status: 401 });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceRoleKey } = getRequiredEnv();

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          error: 'Supabase auth settings are incomplete. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
        },
        { status: 500 }
      );
    }

    const authClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: userData, error: userError } = await authClient.auth.getUser(accessToken);

    if (userError || !userData?.user) {
      return NextResponse.json({ error: 'Your session is no longer valid. Please sign in again.' }, { status: 401 });
    }

    const userScopedClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: membership, error: membershipError } = await userScopedClient
      .from('family_members')
      .select('role')
      .eq('family_group_id', familyGroupId)
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if (membershipError) {
      return NextResponse.json({ error: membershipError.message }, { status: 500 });
    }

    if (!membership || membership.role !== 'admin') {
      return NextResponse.json({ error: 'Only the family admin can send invites.' }, { status: 403 });
    }

    const { data: inviteRecord, error: inviteInsertError } = await userScopedClient
      .from('family_invites')
      .insert({
        family_group_id: familyGroupId,
        invited_by: userData.user.id,
        invited_email: inviteEmail,
        invited_name: inviteName || null,
      })
      .select('id')
      .single();

    if (inviteInsertError) {
      return NextResponse.json({ error: inviteInsertError.message }, { status: 500 });
    }

    const redirectUrl = new URL('/family', request.url);
    redirectUrl.searchParams.set('code', String(inviteCode).toUpperCase());

    if (inviterName) {
      redirectUrl.searchParams.set('inviter', inviterName);
    }

    if (familyGroupName) {
      redirectUrl.searchParams.set('circle', familyGroupName);
    }

    if (!supabaseServiceRoleKey) {
      return NextResponse.json({
        ok: true,
        fallbackEmailInvite: true,
        inviteId: inviteRecord.id,
        inviteLink: redirectUrl.toString(),
      });
    }

    const serviceClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { error: inviteError } = await serviceClient.auth.admin.inviteUserByEmail(inviteEmail, {
      redirectTo: redirectUrl.toString(),
      data: {
        display_name: inviteName || undefined,
        family_group_id: familyGroupId,
        family_group_name: familyGroupName || undefined,
        family_relation: inviteRelation || undefined,
        invited_by: inviterName || undefined,
        invite_code: inviteCode,
      },
    });

    if (inviteError) {
      const inviteMessage = String(inviteError.message || '').toLowerCase();
      if (inviteMessage.includes('already registered') || inviteMessage.includes('already been registered')) {
        return NextResponse.json({
          ok: true,
          existingUserInvite: true,
          inviteId: inviteRecord.id,
          inviteLink: redirectUrl.toString(),
        });
      }

      await userScopedClient
        .from('family_invites')
        .update({ status: 'expired' })
        .eq('id', inviteRecord.id);

      return NextResponse.json({ error: inviteError.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      fallbackEmailInvite: false,
      inviteId: inviteRecord.id,
      inviteLink: redirectUrl.toString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || 'Unable to send the invite.' },
      { status: 500 }
    );
  }
}
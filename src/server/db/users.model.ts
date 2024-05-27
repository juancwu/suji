import sql from '~/server/db/sql';
export interface User {
    id: string; // uuid
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function createUser(
    user: Pick<User, 'email' | 'password'>
): Promise<User> {
    const rows = await sql`
    INSERT INTO users (email, password) VALUES
    (${user.email}, crypt(${user.password}, gen_salt('md5')))
    RETURNING id, email, password, created_at, updated_at;
    `;

    const row = rows[0];
    if (!row) throw new Error('No user returned');
    return row as User;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
    const rows = await sql`
    SELECT id, email, password, created_at, updated_at FROM users WHERE email = ${email}
`;
    return rows[0] as User;
}

export async function getUserById(id: string): Promise<User | undefined> {
    const rows = await sql`
    SELECT id, email, password, created_at, updated_at FROM users WHERE id = ${id}
`;
    return rows[0] as User;
}

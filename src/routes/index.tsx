import { Title } from '@solidjs/meta';
import { createSignal } from 'solid-js';
import { api } from '~/lib/api';

export default function Home() {
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    return (
        <main>
            <Title>SUJI!</Title>
            <input
                type="email"
                class="border border-black p-2"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                class="border border-black p-2"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={() => {
                    api.users.create.mutate({
                        email: email(),
                        password: password(),
                    });
                }}
            >
                Create
            </button>
        </main>
    );
}

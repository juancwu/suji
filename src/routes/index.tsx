import { Title } from '@solidjs/meta';
import { createAsync } from '@solidjs/router';
import { api } from '~/lib/api';

export default function Home() {
    const hello = createAsync(() => api.example.hello.query('world'));
    return (
        <main>
            <Title>SUJI!</Title>
            <pre>
                <code>{JSON.stringify(hello(), null, 2)}</code>
            </pre>
        </main>
    );
}

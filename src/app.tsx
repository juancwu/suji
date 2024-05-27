import { Suspense } from 'solid-js';
import { FileRoutes } from '@solidjs/start/router';
import { Router } from '@solidjs/router';
import { MetaProvider, Title } from '@solidjs/meta';

import './app.css';

export default function App() {
    return (
        <Router
            root={(props) => (
                <MetaProvider>
                    <Title>SUJI - App</Title>
                    <Suspense>{props.children}</Suspense>
                </MetaProvider>
            )}
        >
            <FileRoutes />
        </Router>
    );
}

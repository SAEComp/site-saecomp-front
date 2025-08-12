import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router';
import routes from './routes.tsx';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
    <>
        <RouterProvider router={routes} />
        <Toaster
            position='top-right'
            richColors
            closeButton
            theme='light'
        />
    </>
)


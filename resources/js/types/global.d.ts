import { AxiosInstance } from 'axios';
    import { route as ziggyRoute } from 'ziggy-js';

    declare global {
        interface Window {
            axios: AxiosInstance;
        }

        /* * Ini memberitahu TypeScript bahwa fungsi route()
         * tersedia secara global di seluruh aplikasi.
         */
        var route: typeof ziggyRoute;
    }

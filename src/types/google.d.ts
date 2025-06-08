export { };

declare global {
    namespace google.accounts.id {
        interface CredentialResponse {
            clientId?: string;
            credential: string;
            select_by?: string;
        }

        interface InitializeOptions {
            client_id: string;
            callback: (response: CredentialResponse) => void;
        }

        interface IdConfiguration {
            theme?: 'outline' | 'filled_blue' | 'filled_black';
            size?: 'small' | 'medium' | 'large';
            text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
            shape?: 'rectangular' | 'pill' | 'circle' | 'square';
            type?: 'standard' | 'icon' | 'icon_with_text';
            logo_alignment?: 'left' | 'center';
        }
    }

    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (options: google.accounts.id.InitializeOptions) => void;
                    renderButton: (
                        parent: HTMLElement,
                        options: google.accounts.id.IdConfiguration
                    ) => void;
                    prompt: () => void;
                };
            };
        };
    }
}

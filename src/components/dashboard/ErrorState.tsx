import { FC } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface ErrorStateProps {
    /** Mensagem de erro a ser exibida */
    message?: string
    /** Callback para tentar novamente, se aplicável */
    onRetry?: () => void
}

const ErrorState: FC<ErrorStateProps> = ({
    message = 'Ocorreu um erro inesperado. Por favor, tente novamente.',
    onRetry,
}) => {
    return (
        <Card className="w-full max-w-md mx-auto mt-8">
            <CardContent className="flex flex-col items-center space-y-4 p-6">
                <AlertTriangle className="h-12 w-12 text-red-500" />
                <CardTitle>Ops, algo deu errado</CardTitle>
                <p className="text-center text-gray-700">{message}</p>
                {onRetry && (
                    <Button onClick={onRetry} className="mt-2">
                        Tentar novamente
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}

export default ErrorState

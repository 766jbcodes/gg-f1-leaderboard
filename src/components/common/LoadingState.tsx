export const LoadingState = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center min-h-64">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4" />
      <p className="text-navy font-bold">{message}</p>
    </div>
  </div>
); 
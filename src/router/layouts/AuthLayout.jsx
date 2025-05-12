export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full space-y-8 bg-white rounded-lg shadow">
        {children}
      </div>
    </div>
  );
};

import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input, Button, Card } from '../components/common/UI';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data.username, data.password);
      toast.success('Sikeres bejelentkezés!');
      navigate('/menu');
    } catch (error) {
      toast.error('Hibás felhasználónév vagy jelszó.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Bejelentkezés</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Felhasználónév"
            {...register('username', { required: 'Felhasználónév kötelező' })}
            error={errors.username?.message}
          />
          <Input
            label="Jelszó"
            type="password"
            {...register('password', { required: 'Jelszó kötelező' })}
            error={errors.password?.message}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Bejelentkezés...' : 'Belépés'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            Nincs még fiókod?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Regisztrálj itt
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;

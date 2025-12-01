import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input, Button, Card } from '../components/common/UI';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        role: 'USER' // Default role
      });
      toast.success('Sikeres regisztráció! Most már bejelentkezhetsz.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Hiba történt a regisztráció során.';
      toast.error(msg);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Regisztráció</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Felhasználónév"
            {...register('username', {
                required: 'Felhasználónév kötelező',
                minLength: { value: 3, message: 'Minimum 3 karakter' }
            })}
            error={errors.username?.message}
          />
           <Input
            label="Email"
            type="email"
            {...register('email', {
                required: 'Email kötelező',
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Érvénytelen email cím"
                }
            })}
            error={errors.email?.message}
          />
          <Input
            label="Jelszó"
            type="password"
            {...register('password', {
                required: 'Jelszó kötelező',
                minLength: { value: 6, message: 'Minimum 6 karakter' }
            })}
            error={errors.password?.message}
          />
           <Input
            label="Jelszó megerősítése"
            type="password"
            {...register('confirmPassword', {
                required: 'Jelszó megerősítése kötelező',
                validate: value => value === password || "A jelszavak nem egyeznek"
            })}
            error={errors.confirmPassword?.message}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Regisztráció...' : 'Regisztráció'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            Már van fiókod?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Jelentkezz be
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;

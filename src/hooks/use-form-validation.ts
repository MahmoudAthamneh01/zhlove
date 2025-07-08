import { useForm, UseFormProps, FieldValues, Path } from 'react-hook-form';
import { useTranslations } from 'next-intl';

// Validation rules
export const validationRules = {
  email: {
    required: true,
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Please enter a valid email address'
    }
  },
  password: {
    required: true,
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters'
    }
  },
  username: {
    required: true,
    minLength: {
      value: 3,
      message: 'Username must be at least 3 characters'
    },
    pattern: {
      value: /^[a-zA-Z0-9_-]+$/,
      message: 'Username can only contain letters, numbers, hyphens, and underscores'
    }
  },
  required: {
    required: true
  }
};

// Custom hook for form validation with i18n support
export function useFormValidation<T extends FieldValues>(
  props?: UseFormProps<T>
) {
  const t = useTranslations('auth.validation');
  const form = useForm<T>(props);

  // Helper function to get validation rules with translated messages
  const getValidationRules = (field: keyof typeof validationRules) => {
    const rules = validationRules[field] as any;
    
    return {
      ...rules,
      required: rules.required ? t(`${field}Required` as any) : false,
      minLength: rules.minLength ? {
        ...rules.minLength,
        message: t(`${field}TooShort` as any)
      } : undefined,
      pattern: rules.pattern ? {
        ...rules.pattern,
        message: t(`${field}Invalid` as any)
      } : undefined
    };
  };

  // Helper function to validate password confirmation
  const validatePasswordConfirmation = (value: string, watchPassword: string) => {
    return value === watchPassword || t('passwordsDoNotMatch');
  };

  return {
    ...form,
    getValidationRules,
    validatePasswordConfirmation
  };
}

// Specific form hooks for different forms

// Login form hook
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export function useLoginForm() {
  return useFormValidation<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });
}

// Signup form hook
export interface SignupFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  country?: string;
  favoriteGameMode?: string;
  agreeToTerms: boolean;
}

export function useSignupForm() {
  const form = useFormValidation<SignupFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      country: '',
      favoriteGameMode: '',
      agreeToTerms: false
    }
  });

  return {
    ...form,
    // Additional validation for signup form
    validateConfirmPassword: (value: string) => {
      const password = form.watch('password');
      return form.validatePasswordConfirmation(value, password);
    }
  };
}

// Support form hook
export interface SupportFormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

export function useSupportForm() {
  return useFormValidation<SupportFormData>({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      category: '',
      message: ''
    }
  });
}

// Tournament creation form hook
export interface TournamentFormData {
  name: string;
  description: string;
  type: '1v1' | 'team' | 'ffa';
  maxParticipants: number;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  prizePool: string;
  rules: string;
  maps: string[];
  streamChannel?: string;
}

export function useTournamentForm() {
  return useFormValidation<TournamentFormData>({
    defaultValues: {
      name: '',
      description: '',
      type: '1v1',
      maxParticipants: 32,
      startDate: '',
      endDate: '',
      registrationDeadline: '',
      prizePool: '',
      rules: '',
      maps: [],
      streamChannel: ''
    }
  });
} 
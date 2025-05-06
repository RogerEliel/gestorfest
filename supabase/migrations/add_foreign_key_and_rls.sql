
-- Add foreign key constraint to link usuarios with auth.users
ALTER TABLE public.usuarios
ADD CONSTRAINT fk_usuarios_auth_users
FOREIGN KEY (id) REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read only their own profile
CREATE POLICY "Users can read their own profile"
ON public.usuarios
FOR SELECT
USING (id = auth.uid());

-- Create policy for users to update only their own profile
CREATE POLICY "Users can update their own profile"
ON public.usuarios 
FOR UPDATE
USING (id = auth.uid());

-- Create policy for users to insert their own profile during signup
CREATE POLICY "Users can insert their own profile"
ON public.usuarios
FOR INSERT
WITH CHECK (id = auth.uid());

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.usuarios
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Enable Row Level Security for the `interventions` table and create policies
-- Only the owner (user_id = auth.uid()) can SELECT, INSERT, UPDATE, DELETE

-- Enable RLS on the table
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;

-- SELECT policy
CREATE POLICY "Allow owners to read their interventions"
  ON public.interventions
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT policy
CREATE POLICY "Allow owners to insert their interventions"
  ON public.interventions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE policy (if needed to edit a record)
CREATE POLICY "Allow owners to update their interventions"
  ON public.interventions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE policy (if needed)
CREATE POLICY "Allow owners to delete their interventions"
  ON public.interventions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Ensure default SELECT policy is disabled (it is when RLS is enabled)
ALTER TABLE public.interventions FORCE ROW LEVEL SECURITY;

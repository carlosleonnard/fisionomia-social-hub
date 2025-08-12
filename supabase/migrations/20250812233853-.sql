-- Add delete policy for comments table to allow users to delete their own comments
CREATE POLICY "Users can delete their own comments" 
ON public.comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create a function to delete a comment and all its child comments
CREATE OR REPLACE FUNCTION public.delete_comment_and_children(comment_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete all child comments first (recursively)
  DELETE FROM public.comments 
  WHERE parent_comment_id = comment_id_param;
  
  -- Delete the parent comment
  DELETE FROM public.comments 
  WHERE id = comment_id_param AND user_id = auth.uid();
END;
$$;
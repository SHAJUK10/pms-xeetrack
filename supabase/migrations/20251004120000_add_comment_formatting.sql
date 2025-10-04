/*
  # Add formatted_content support to comment tables

  1. Changes
    - Add `formatted_content` JSONB column to `global_comments` table
    - Add `formatted_content` JSONB column to `page_comments` table (if exists)
    - Store formatting metadata as JSON including bold, italics, and list markers
    - Keep the `text` column for plain text version (search and fallback)

  2. Structure
    The formatted_content JSONB will store:
    {
      "version": 1,
      "blocks": [
        {
          "type": "text",
          "content": "plain text",
          "formatting": ["bold", "italic"]
        },
        {
          "type": "list",
          "items": ["item 1", "item 2"]
        }
      ]
    }

  3. Security
    - No changes to existing RLS policies
    - New column inherits same access controls as other comment columns

  4. Backward Compatibility
    - Column is nullable to support existing comments
    - Existing comments without formatted_content display as plain text
*/

-- Add formatted_content column to global_comments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'global_comments' AND column_name = 'formatted_content'
  ) THEN
    ALTER TABLE global_comments ADD COLUMN formatted_content JSONB;
  END IF;
END $$;

-- Add formatted_content column to page_comments table (if it exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'page_comments'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'page_comments' AND column_name = 'formatted_content'
    ) THEN
      ALTER TABLE page_comments ADD COLUMN formatted_content JSONB;
    END IF;
  END IF;
END $$;

-- Add formatted_content column to comment_tasks table (if it exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'comment_tasks'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'comment_tasks' AND column_name = 'formatted_content'
    ) THEN
      ALTER TABLE comment_tasks ADD COLUMN formatted_content JSONB;
    END IF;
  END IF;
END $$;

-- Create index for formatted_content queries on global_comments
CREATE INDEX IF NOT EXISTS idx_global_comments_formatted_content
  ON global_comments USING gin(formatted_content);

-- Create index for formatted_content queries on page_comments (if exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'page_comments'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_page_comments_formatted_content
      ON page_comments USING gin(formatted_content);
  END IF;
END $$;

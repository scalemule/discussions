import type { CSSProperties } from 'react';

export interface DiscussionTheme {
  primary?: string;
  primaryText?: string;
  surface?: string;
  borderColor?: string;
  textColor?: string;
  mutedText?: string;
  headingColor?: string;
  fontFamily?: string;
  headingFontFamily?: string;
  borderRadius?: string;
}

type ThemeStyle = CSSProperties & Record<string, string | number | undefined>;

export function themeToStyle(theme?: DiscussionTheme): ThemeStyle {
  return {
    '--sm-d-primary': theme?.primary ?? '#bb171d',
    '--sm-d-primary-text': theme?.primaryText ?? '#ffffff',
    '--sm-d-surface': theme?.surface ?? '#ffffff',
    '--sm-d-border': theme?.borderColor ?? '#d7dcd7',
    '--sm-d-text': theme?.textColor ?? '#171917',
    '--sm-d-muted': theme?.mutedText ?? '#5c635c',
    '--sm-d-heading': theme?.headingColor ?? '#171917',
    '--sm-d-radius': theme?.borderRadius ?? '0',
    '--sm-d-font': theme?.fontFamily ?? 'Arial, sans-serif',
    '--sm-d-heading-font': theme?.headingFontFamily ?? 'Georgia, serif',
  };
}

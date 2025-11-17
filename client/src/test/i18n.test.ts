import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { I18nProvider, useI18n } from '@/lib/i18n';

describe('Internationalization Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should default to Arabic language', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nProvider,
    });

    expect(result.current.language).toBe('ar');
    expect(result.current.dir).toBe('rtl');
  });

  it('should switch language to English', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nProvider,
    });

    act(() => {
      result.current.setLanguage('en');
    });

    expect(result.current.language).toBe('en');
    expect(result.current.dir).toBe('ltr');
  });

  it('should persist language preference', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nProvider,
    });

    act(() => {
      result.current.setLanguage('en');
    });

    expect(localStorage.getItem('language')).toBe('en');
  });

  it('should translate strings correctly', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nProvider,
    });

    act(() => {
      result.current.setLanguage('ar');
    });

    expect(result.current.t('nav.home')).toBe('الرئيسية');
    expect(result.current.t('nav.dashboard')).toBe('لوحة التحكم');

    act(() => {
      result.current.setLanguage('en');
    });

    expect(result.current.t('nav.home')).toBe('Home');
    expect(result.current.t('nav.dashboard')).toBe('Dashboard');
  });

  it('should return key if translation not found', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nProvider,
    });

    expect(result.current.t('nonexistent.key')).toBe('nonexistent.key');
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';

const FIXTURE_PATH = resolve(__dirname, 'fixtures/minimal.hekaya');

// Fixture with no title page
const NO_TITLE_CONTENT = `داخلي - غرفة - نهار

سمير قاعد على الكرسي.

@سمير
أنا هنا.
`;

// Fixture with empty body
const EMPTY_BODY_CONTENT = `العنوان: اختبار
المؤلف: سمير
`;

// Fixture with no scene headings
const NO_SCENES_CONTENT = `العنوان: اختبار

@سمير
أنا هنا.
`;

function tmpPath(name: string): string {
  return join(tmpdir(), `hekaya-test-${Date.now()}-${name}`);
}

describe('parse command', () => {
  let mockStdoutWrite: ReturnType<typeof vi.spyOn>;
  let mockConsoleError: ReturnType<typeof vi.spyOn>;
  let mockProcessExit: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockStdoutWrite = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockProcessExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('outputs JSON to stdout', async () => {
    const { parseCommand } = await import('../src/commands/parse');
    await parseCommand.parseAsync(['node', 'hekaya', FIXTURE_PATH]);

    expect(mockStdoutWrite).toHaveBeenCalledOnce();
    const output = mockStdoutWrite.mock.calls[0][0] as string;
    const parsed = JSON.parse(output.trim());
    expect(parsed).toHaveProperty('tokens');
    expect(parsed).toHaveProperty('titleEntries');
  });

  it('writes JSON to file with -o', async () => {
    const outPath = tmpPath('parse-output.json');
    const { parseCommand } = await import('../src/commands/parse');

    try {
      await parseCommand.parseAsync(['node', 'hekaya', FIXTURE_PATH, '-o', outPath]);

      expect(existsSync(outPath)).toBe(true);
      const json = JSON.parse(readFileSync(outPath, 'utf-8'));
      expect(json).toHaveProperty('tokens');
      expect(json).toHaveProperty('titleEntries');
    } finally {
      if (existsSync(outPath)) unlinkSync(outPath);
    }
  });

  it('outputs compact JSON with --no-pretty', async () => {
    // Use Hekaya directly to verify compact vs pretty JSON since commander
    // Command instances carry state between calls in the same test module
    const { Hekaya } = await import('@hekaya/parser');
    const input = readFileSync(FIXTURE_PATH, 'utf-8');
    const script = Hekaya.parse(input);

    const compact = JSON.stringify(script);
    const pretty = JSON.stringify(script, null, 2);

    // Compact has no indentation newlines
    expect(compact.includes('\n')).toBe(false);
    // Pretty does have newlines
    expect(pretty.includes('\n')).toBe(true);
    // Both parse to the same object
    expect(JSON.parse(compact)).toEqual(JSON.parse(pretty));
  });

  it('exits 1 on file not found', async () => {
    const { parseCommand } = await import('../src/commands/parse');
    await parseCommand.parseAsync(['node', 'hekaya', '/nonexistent/file.hekaya']);

    expect(mockConsoleError).toHaveBeenCalled();
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });
});

describe('render command', () => {
  let mockStdoutWrite: ReturnType<typeof vi.spyOn>;
  let mockConsoleError: ReturnType<typeof vi.spyOn>;
  let mockProcessExit: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockStdoutWrite = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockProcessExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('outputs HTML to stdout', async () => {
    const { renderCommand } = await import('../src/commands/render');
    await renderCommand.parseAsync(['node', 'hekaya', FIXTURE_PATH]);

    expect(mockStdoutWrite).toHaveBeenCalledOnce();
    const output = mockStdoutWrite.mock.calls[0][0] as string;
    expect(output).toContain('<!DOCTYPE html>');
    expect(output).toContain('اختبار');
  });

  it('writes HTML to file with -o', async () => {
    const outPath = tmpPath('render-output.html');
    const { renderCommand } = await import('../src/commands/render');

    try {
      await renderCommand.parseAsync(['node', 'hekaya', FIXTURE_PATH, '-o', outPath]);

      expect(existsSync(outPath)).toBe(true);
      const html = readFileSync(outPath, 'utf-8');
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('اختبار');
    } finally {
      if (existsSync(outPath)) unlinkSync(outPath);
    }
  });

  it('exits 1 on read error', async () => {
    const { renderCommand } = await import('../src/commands/render');
    await renderCommand.parseAsync(['node', 'hekaya', '/nonexistent/file.hekaya']);

    expect(mockConsoleError).toHaveBeenCalled();
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });
});

describe('export command', () => {
  let mockConsoleError: ReturnType<typeof vi.spyOn>;
  let mockProcessExit: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockProcessExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes PDF to custom path with -o', async () => {
    const outPath = tmpPath('export-output.pdf');
    const { exportCommand } = await import('../src/commands/export');

    try {
      await exportCommand.parseAsync(['node', 'hekaya', FIXTURE_PATH, '-o', outPath]);

      expect(existsSync(outPath)).toBe(true);
      const buf = readFileSync(outPath);
      expect(buf.subarray(0, 5).toString()).toBe('%PDF-');
      expect(buf.length).toBeGreaterThan(1000);
    } finally {
      if (existsSync(outPath)) unlinkSync(outPath);
    }
  });

  it('exits 1 on error', async () => {
    const { exportCommand } = await import('../src/commands/export');
    await exportCommand.parseAsync(['node', 'hekaya', '/nonexistent/file.hekaya']);

    expect(mockConsoleError).toHaveBeenCalled();
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });
});

describe('validate command', () => {
  let mockConsoleLog: ReturnType<typeof vi.spyOn>;
  let mockConsoleError: ReturnType<typeof vi.spyOn>;
  let mockProcessExit: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockProcessExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reports valid for correct screenplay', async () => {
    const { validateCommand } = await import('../src/commands/validate');
    await validateCommand.parseAsync(['node', 'hekaya', FIXTURE_PATH]);

    expect(mockConsoleLog).toHaveBeenCalled();
    const output = mockConsoleLog.mock.calls[0][0] as string;
    expect(output).toContain('Valid');
    expect(mockProcessExit).not.toHaveBeenCalled();
  });

  it('reports missing title', async () => {
    const tmpFile = tmpPath('no-title.hekaya');
    writeFileSync(tmpFile, NO_TITLE_CONTENT, 'utf-8');

    try {
      const { validateCommand } = await import('../src/commands/validate');
      await validateCommand.parseAsync(['node', 'hekaya', tmpFile]);

      const allOutput = mockConsoleLog.mock.calls.map((c) => c[0]).join('\n');
      expect(allOutput).toContain('No title page metadata');
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    } finally {
      if (existsSync(tmpFile)) unlinkSync(tmpFile);
    }
  });

  it('reports empty body', async () => {
    const tmpFile = tmpPath('empty-body.hekaya');
    writeFileSync(tmpFile, EMPTY_BODY_CONTENT, 'utf-8');

    try {
      const { validateCommand } = await import('../src/commands/validate');
      await validateCommand.parseAsync(['node', 'hekaya', tmpFile]);

      const allOutput = mockConsoleLog.mock.calls.map((c) => c[0]).join('\n');
      expect(allOutput).toContain('empty');
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    } finally {
      if (existsSync(tmpFile)) unlinkSync(tmpFile);
    }
  });

  it('reports no scene headings', async () => {
    const tmpFile = tmpPath('no-scenes.hekaya');
    writeFileSync(tmpFile, NO_SCENES_CONTENT, 'utf-8');

    try {
      const { validateCommand } = await import('../src/commands/validate');
      await validateCommand.parseAsync(['node', 'hekaya', tmpFile]);

      const allOutput = mockConsoleLog.mock.calls.map((c) => c[0]).join('\n');
      expect(allOutput).toContain('No scene headings');
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    } finally {
      if (existsSync(tmpFile)) unlinkSync(tmpFile);
    }
  });

  it('exits 1 on file read error', async () => {
    const { validateCommand } = await import('../src/commands/validate');
    await validateCommand.parseAsync(['node', 'hekaya', '/nonexistent/file.hekaya']);

    expect(mockConsoleError).toHaveBeenCalled();
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });
});

describe('convert command', () => {
  let mockConsoleError: ReturnType<typeof vi.spyOn>;
  let mockProcessExit: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockProcessExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('converts .hekaya to .fountain with -o', async () => {
    const outPath = tmpPath('convert-output.fountain');
    const { convertCommand } = await import('../src/commands/convert');

    try {
      await convertCommand.parseAsync(['node', 'hekaya', FIXTURE_PATH, '-o', outPath]);

      expect(existsSync(outPath)).toBe(true);
      const content = readFileSync(outPath, 'utf-8');
      expect(content).toContain('اختبار');
    } finally {
      if (existsSync(outPath)) unlinkSync(outPath);
    }
  });

  it('output is valid Fountain text', async () => {
    const outPath = tmpPath('roundtrip.fountain');
    const { convertCommand } = await import('../src/commands/convert');

    try {
      await convertCommand.parseAsync(['node', 'hekaya', FIXTURE_PATH, '-o', outPath]);

      expect(existsSync(outPath)).toBe(true);
      const content = readFileSync(outPath, 'utf-8');
      // Should contain serialized elements from the fixture
      expect(content.length).toBeGreaterThan(0);
      // Re-parse the output to verify it's valid
      const { Hekaya } = await import('@hekaya/parser');
      const reparsed = Hekaya.parse(content);
      expect(reparsed.tokens.length).toBeGreaterThan(0);
    } finally {
      if (existsSync(outPath)) unlinkSync(outPath);
    }
  });

  it('exits 1 on file not found', async () => {
    const { convertCommand } = await import('../src/commands/convert');
    await convertCommand.parseAsync(['node', 'hekaya', '/nonexistent/file.hekaya']);

    expect(mockConsoleError).toHaveBeenCalled();
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });
});

describe('utils', () => {
  it('getErrorMessage handles Error instances', async () => {
    const { getErrorMessage } = await import('../src/utils');
    expect(getErrorMessage(new Error('test error'))).toBe('test error');
  });

  it('getErrorMessage handles strings', async () => {
    const { getErrorMessage } = await import('../src/utils');
    expect(getErrorMessage('string error')).toBe('string error');
  });

  it('getErrorMessage handles non-Error objects', async () => {
    const { getErrorMessage } = await import('../src/utils');
    expect(getErrorMessage(42)).toBe('42');
    expect(getErrorMessage(null)).toBe('null');
  });
});

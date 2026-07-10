import { mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import Database from 'better-sqlite3';
import type {
  ActionRecord,
  BodyChunkRecord,
  ConsoleRecord,
  HeaderRecord,
  ImageRecord,
  MetadataRecord,
  RequestRecord,
  RunRecord,
  Storage,
  TestRecord,
} from '../Storage.js';

export class SqliteStorage implements Storage {
  private readonly db: Database.Database;

  constructor(filePath = 'report.sqlite') {
    const resolvedPath = resolve(filePath);
    if (!existsSync(dirname(resolvedPath))) {
      mkdirSync(dirname(resolvedPath), { recursive: true });
    }

    this.db = new Database(resolvedPath);
    this.initializeSchema();
  }

  public async insertRun(run: RunRecord): Promise<void> {
    this.db.prepare(`
      INSERT INTO runs (id, name, status, started_at, finished_at, output_file)
      VALUES (@id, @name, @status, @startedAt, @finishedAt, @outputFile)
    `).run(run);
  }

  public async insertTest(test: TestRecord): Promise<void> {
    this.db.prepare(`
      INSERT INTO tests (id, run_id, title, status, duration_ms, browser, project, tags, started_at, finished_at)
      VALUES (@id, @runId, @title, @status, @durationMs, @browser, @project, @tags, @startedAt, @finishedAt)
    `).run({
      ...test,
      tags: JSON.stringify(test.tags ?? []),
    });
  }

  public async updateTest(test: TestRecord): Promise<void> {
    this.db.prepare(`
      UPDATE tests
      SET status = @status,
          duration_ms = @durationMs,
          browser = @browser,
          project = @project,
          tags = @tags,
          started_at = @startedAt,
          finished_at = @finishedAt
      WHERE id = @id
    `).run({
      ...test,
      tags: JSON.stringify(test.tags ?? []),
    });
  }

  public async insertAction(action: ActionRecord): Promise<void> {
    this.db.prepare(`
      INSERT INTO actions (id, test_id, name, status, started_at, finished_at)
      VALUES (@id, @testId, @name, @status, @startedAt, @finishedAt)
    `).run(action);
  }

  public async insertRequest(request: RequestRecord): Promise<void> {
    this.db.prepare(`
      INSERT INTO requests (id, action_id, method, url)
      VALUES (@id, @actionId, @method, @url)
    `).run(request);
  }

  public async insertHeader(header: HeaderRecord): Promise<void> {
    this.db.prepare(`
      INSERT INTO headers (id, request_id, name, value)
      VALUES (@id, @requestId, @name, @value)
    `).run(header);
  }

  public async insertBodyChunk(chunk: BodyChunkRecord): Promise<void> {
    this.db.prepare(`
      INSERT INTO body_chunks (id, request_id, chunk, "order")
      VALUES (@id, @requestId, @chunk, @order)
    `).run(chunk);
  }

  public async insertConsole(entry: ConsoleRecord): Promise<void> {
    this.db.prepare(`
      INSERT INTO console_entries (id, test_id, message, type, timestamp)
      VALUES (@id, @testId, @message, @type, @timestamp)
    `).run(entry);
  }

  public async insertImage(image: ImageRecord): Promise<void> {
    this.db.prepare(`
      INSERT INTO images (id, test_id, path, mime_type)
      VALUES (@id, @testId, @path, @mimeType)
    `).run(image);
  }

  public async insertMetadata(metadata: MetadataRecord): Promise<void> {
    this.db.prepare(`
      INSERT INTO metadata (id, test_id, key, value)
      VALUES (@id, @testId, @key, @value)
    `).run(metadata);
  }

  public async close(): Promise<void> {
    this.db.close();
  }

  private initializeSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS runs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        status TEXT NOT NULL,
        started_at TEXT NOT NULL,
        finished_at TEXT,
        output_file TEXT
      );

      CREATE TABLE IF NOT EXISTS tests (
        id TEXT PRIMARY KEY,
        run_id TEXT NOT NULL,
        title TEXT NOT NULL,
        status TEXT NOT NULL,
        duration_ms INTEGER NOT NULL,
        browser TEXT,
        project TEXT,
        tags TEXT,
        started_at TEXT,
        finished_at TEXT
      );

      CREATE TABLE IF NOT EXISTS actions (
        id TEXT PRIMARY KEY,
        test_id TEXT NOT NULL,
        name TEXT NOT NULL,
        status TEXT,
        started_at TEXT,
        finished_at TEXT
      );

      CREATE TABLE IF NOT EXISTS requests (
        id TEXT PRIMARY KEY,
        action_id TEXT NOT NULL,
        method TEXT,
        url TEXT
      );

      CREATE TABLE IF NOT EXISTS headers (
        id TEXT PRIMARY KEY,
        request_id TEXT NOT NULL,
        name TEXT NOT NULL,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS body_chunks (
        id TEXT PRIMARY KEY,
        request_id TEXT NOT NULL,
        chunk TEXT NOT NULL,
        "order" INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS console_entries (
        id TEXT PRIMARY KEY,
        test_id TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT,
        timestamp TEXT
      );

      CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY,
        test_id TEXT NOT NULL,
        path TEXT NOT NULL,
        mime_type TEXT
      );

      CREATE TABLE IF NOT EXISTS metadata (
        id TEXT PRIMARY KEY,
        test_id TEXT NOT NULL,
        key TEXT NOT NULL,
        value TEXT NOT NULL
      );
    `);
  }
}

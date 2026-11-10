import { http, HttpResponse } from "msw";
import {
  createFile,
  createFolder,
  getDefaultDataRetention,
  hasActiveFolder,
  listFiles,
  listFolders,
  listTrash,
  moveFileToTrash,
  moveFolderToTrash,
  permanentlyDeleteFile,
  permanentlyDeleteFolder,
  restoreFile,
  restoreFolder,
  setDefaultDataRetention,
} from "./db";
import { retentionSeconds } from "../features/dataRetention/api";

const apiUrl = "http://localhost:3001";

function notFound(message: string) {
  return HttpResponse.json({ message }, { status: 404 });
}

export const handlers = [
  http.get(`${apiUrl}/folders`, ({ request }) => {
    const parentId = new URL(request.url).searchParams.get("parentId");
    return HttpResponse.json(listFolders(parentId));
  }),

  http.post(`${apiUrl}/folders`, async ({ request }) => {
    const body = (await request.json()) as {
      name: string;
      parentId: string | null;
    };
    if (body.parentId && !hasActiveFolder(body.parentId)) {
      return notFound(`Folder ${body.parentId} does not exist`);
    }
    return HttpResponse.json(createFolder(body.name, body.parentId), {
      status: 201,
    });
  }),

  http.delete(`${apiUrl}/folders/:id`, ({ params }) => {
    const id = String(params.id);
    return moveFolderToTrash(id)
      ? new HttpResponse(null, { status: 204 })
      : notFound(`Folder ${id} does not exist`);
  }),

  http.get(`${apiUrl}/files`, ({ request }) => {
    const folderId = new URL(request.url).searchParams.get("folderId");
    return HttpResponse.json(listFiles(folderId));
  }),

  http.post(`${apiUrl}/files`, async ({ request }) => {
    const body = (await request.json()) as {
      name: string;
      contentType: string;
      size: number;
      folderId: string | null;
    };
    if (body.folderId && !hasActiveFolder(body.folderId)) {
      return notFound(`Folder ${body.folderId} does not exist`);
    }
    return HttpResponse.json(
      createFile(body.name, body.contentType, body.size, body.folderId),
      { status: 201 },
    );
  }),

  http.delete(`${apiUrl}/files/:id`, ({ params }) => {
    const id = String(params.id);
    return moveFileToTrash(id)
      ? new HttpResponse(null, { status: 204 })
      : notFound(`File ${id} does not exist`);
  }),

  http.get(`${apiUrl}/trash`, () => HttpResponse.json(listTrash())),

  http.get(`${apiUrl}/data-retention/default`, () =>
    HttpResponse.json(getDefaultDataRetention()),
  ),

  http.patch(`${apiUrl}/data-retention/default`, async ({ request }) => {
    const body = (await request.json()) as { periodSeconds?: unknown };
    if (
      body.periodSeconds !== null &&
      (typeof body.periodSeconds !== "number" ||
        !(
          Object.values(retentionSeconds) as readonly (number | null)[]
        ).includes(body.periodSeconds))
    ) {
      return HttpResponse.json(
        { message: "Invalid retention time" },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      setDefaultDataRetention({
        id: 1,
        periodSeconds: body.periodSeconds as number | null,
      }),
    );
  }),

  http.patch(`${apiUrl}/trash/files/:id/restore`, ({ params }) => {
    const id = String(params.id);
    return restoreFile(id)
      ? new HttpResponse(null, { status: 204 })
      : notFound(`File ${id} does not exist in trash`);
  }),

  http.patch(`${apiUrl}/trash/folders/:id/restore`, ({ params }) => {
    const id = String(params.id);
    return restoreFolder(id)
      ? new HttpResponse(null, { status: 204 })
      : notFound(`Folder ${id} does not exist in trash`);
  }),

  http.delete(`${apiUrl}/trash/purge/file/:id`, ({ params }) => {
    const id = String(params.id);
    return permanentlyDeleteFile(id)
      ? new HttpResponse(null, { status: 204 })
      : notFound(`File ${id} does not exist in trash`);
  }),

  http.delete(`${apiUrl}/trash/purge/folder/:id`, ({ params }) => {
    const id = String(params.id);
    return permanentlyDeleteFolder(id)
      ? new HttpResponse(null, { status: 204 })
      : notFound(`Folder ${id} does not exist in trash`);
  }),
];

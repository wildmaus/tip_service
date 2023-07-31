import { ArtifactStore } from '@railgun-community/quickstart';
import fs from 'fs';
import path from 'path';

const createDownloadDirPath = (documentsDir, path) => {
    return `${documentsDir}/${path}`;
};

const createArtifactStore = (documentsDir) => {
    const getFile = async (path) => {
        return fs.promises.readFile(createDownloadDirPath(documentsDir, path));
    };

    const storeFile = async (
        dir,
        path,
        item,
    ) => {
        await fs.promises.mkdir(createDownloadDirPath(documentsDir, dir), {
            recursive: true,
        });
        await fs.promises.writeFile(
            createDownloadDirPath(documentsDir, path),
            item,
        );
    };

    const fileExists = (path) => {
        return new Promise(resolve => {
            fs.promises
                .access(createDownloadDirPath(documentsDir, path))
                .then(() => resolve(true))
                .catch(() => resolve(false));
        });
    };

    return new ArtifactStore(getFile, storeFile, fileExists);
};

export const artifactStore = createArtifactStore(
    path.join(path.resolve(), 'data', 'artifact_store')
);
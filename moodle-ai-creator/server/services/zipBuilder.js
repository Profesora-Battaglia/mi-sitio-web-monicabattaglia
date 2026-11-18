import zlib from 'node:zlib';

/**
 * MoodleAI Creator — Motor Empaquetador ZIP Nativo (PKZIP Estándar)
 * Utiliza node:zlib (deflateRawSync + crc32) para construir archivos .zip (SCORM)
 * y .h5p (H5P) válidos en memoria sin depender de binarios externos.
 */

function toDosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = Math.floor(date.getSeconds() / 2);

  const dosTime = (hours << 11) | (minutes << 5) | seconds;
  const dosDate = ((year - 1980) << 9) | (month << 5) | day;
  return { dosTime, dosDate };
}

/**
 * Construye un Buffer ZIP válido a partir de un arreglo de archivos:
 * files = [{ path: 'imsmanifest.xml', content: '...' | Buffer }, ...]
 */
export function buildZipBuffer(files = []) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const { dosTime, dosDate } = toDosDateTime();

  for (const file of files) {
    const normalizedPath = String(file.path).replace(/\\/g, '/').replace(/^\/+/, '');
    const nameBuf = Buffer.from(normalizedPath, 'utf-8');
    const rawData = Buffer.isBuffer(file.content)
      ? file.content
      : Buffer.from(String(file.content ?? ''), 'utf-8');

    const crc = zlib.crc32(rawData) >>> 0;
    const compressedData = zlib.deflateRawSync(rawData);
    const compressionMethod = 8; // DEFLATE

    // 1. Local File Header (30 bytes + filename)
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0); // Local file header signature
    localHeader.writeUInt16LE(20, 4);         // Version needed to extract (2.0)
    localHeader.writeUInt16LE(0x0800, 6);     // General purpose bit flag (UTF-8 filename)
    localHeader.writeUInt16LE(compressionMethod, 8);
    localHeader.writeUInt16LE(dosTime, 10);
    localHeader.writeUInt16LE(dosDate, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressedData.length, 18);
    localHeader.writeUInt32LE(rawData.length, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);         // Extra field length

    localParts.push(localHeader, nameBuf, compressedData);

    // 2. Central Directory File Header (46 bytes + filename)
    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0); // Central directory signature
    centralHeader.writeUInt16LE(20, 4);         // Version made by
    centralHeader.writeUInt16LE(20, 6);         // Version needed to extract
    centralHeader.writeUInt16LE(0x0800, 8);     // UTF-8 flag
    centralHeader.writeUInt16LE(compressionMethod, 10);
    centralHeader.writeUInt16LE(dosTime, 12);
    centralHeader.writeUInt16LE(dosDate, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressedData.length, 20);
    centralHeader.writeUInt32LE(rawData.length, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);         // Extra field length
    centralHeader.writeUInt16LE(0, 32);         // File comment length
    centralHeader.writeUInt16LE(0, 34);         // Disk number start
    centralHeader.writeUInt16LE(0, 36);         // Internal file attributes
    centralHeader.writeUInt32LE(0, 38);         // External file attributes
    centralHeader.writeUInt32LE(offset, 42);    // Relative offset of local header

    centralParts.push(centralHeader, nameBuf);

    offset += localHeader.length + nameBuf.length + compressedData.length;
  }

  const centralDirBuffer = Buffer.concat(centralParts);
  const centralDirOffset = offset;
  const centralDirSize = centralDirBuffer.length;

  // 3. End of Central Directory Record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);            // EOCD signature
  eocd.writeUInt16LE(0, 4);                     // Number of this disk
  eocd.writeUInt16LE(0, 6);                     // Disk where central directory starts
  eocd.writeUInt16LE(files.length, 8);          // Total entries on this disk
  eocd.writeUInt16LE(files.length, 10);         // Total entries in central directory
  eocd.writeUInt32LE(centralDirSize, 12);       // Size of central directory
  eocd.writeUInt32LE(centralDirOffset, 16);     // Offset of central directory
  eocd.writeUInt16LE(0, 20);                    // Comment length

  return Buffer.concat([...localParts, centralDirBuffer, eocd]);
}

/**
 * Lector e inspector de entradas de un Buffer ZIP (para validación y pruebas de estructura)
 */
export function inspectZipBuffer(zipBuffer) {
  const entries = {};
  let pos = 0;

  while (pos + 30 <= zipBuffer.length) {
    const sig = zipBuffer.readUInt32LE(pos);
    if (sig !== 0x04034b50) break; // Fin de Local File Headers

    const method = zipBuffer.readUInt16LE(pos + 8);
    const compressedSize = zipBuffer.readUInt32LE(pos + 18);
    const nameLen = zipBuffer.readUInt16LE(pos + 26);
    const extraLen = zipBuffer.readUInt16LE(pos + 28);

    const nameStart = pos + 30;
    const fileName = zipBuffer.subarray(nameStart, nameStart + nameLen).toString('utf-8');
    const dataStart = nameStart + nameLen + extraLen;
    const compressedSlice = zipBuffer.subarray(dataStart, dataStart + compressedSize);

    const uncompressed = method === 8
      ? zlib.inflateRawSync(compressedSlice)
      : compressedSlice;

    entries[fileName] = uncompressed.toString('utf-8');
    pos = dataStart + compressedSize;
  }

  return entries;
}

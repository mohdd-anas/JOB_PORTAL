// Simple file handler - saves as base64 data URL
export const uploadFile = async (file) => {
    const base64 = file.buffer.toString('base64');
    const dataUrl = `data:${file.mimetype};base64,${base64}`;
    return dataUrl;
};
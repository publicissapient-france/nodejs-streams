describe('Buffer', () => {
  test('should works with Bytes', () => {
    const string = 'vidéo';
    const buffer = Buffer.from(string, 'utf8');
    const bytes = Array.from(buffer.values());
    const string2 = Buffer.from(bytes).toString();

    expect(string.length).toBe(5);
    expect(buffer.length).toBe(6); // 6 et non 5, car le "é" de "vidéo" est encodé sur 2-bit!
    expect(bytes).toEqual([118, 105, 100, 195, 169, 111]);
    expect(string2).toBe(string);
  });
});

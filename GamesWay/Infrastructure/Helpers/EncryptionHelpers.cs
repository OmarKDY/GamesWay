using System.Security.Cryptography;
using System.Text;

namespace GamesWay.Infrastructure.Helpers
{
    public class EncryptionHelpers
    {
        public static async Task<string> EncryptFieldAsync(string plainText, string key)
        {
            using Aes aesAlg = Aes.Create();
            aesAlg.Key = Encoding.UTF8.GetBytes(key);
            aesAlg.Mode = CipherMode.ECB; // Use ECB mode for simplicity, but not recommended for production use
            aesAlg.Padding = PaddingMode.PKCS7; // Use PKCS7 padding

            using ICryptoTransform encryptor = aesAlg.CreateEncryptor();

            using MemoryStream msEncrypt = new MemoryStream();
            using CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write);

            using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
            {
                await swEncrypt.WriteAsync(plainText);
            }

            byte[] encryptedData = msEncrypt.ToArray();

            return Convert.ToBase64String(encryptedData);
        }

        public static async Task<string> DecryptAsync(string encryptedData, string secretKeyPhrase)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Encoding.UTF8.GetBytes(secretKeyPhrase);
                aesAlg.Mode = CipherMode.ECB; // Use ECB mode for simplicity, but not recommended for production use
                aesAlg.Padding = PaddingMode.PKCS7; // Use PKCS7 padding

                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                byte[] encryptedBytes = Convert.FromBase64String(encryptedData);

                string decryptedText;

                using (MemoryStream msDecrypt = new MemoryStream(encryptedBytes))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            decryptedText = srDecrypt.ReadToEnd();
                        }
                    }
                }

                return decryptedText;
            }
        }



        public static async Task<(string EncryptedUser, string EncryptedPassword, string EncryptedPackageId, string EncryptedMsisdn)>
            EncryptFieldsAsync(string user, string password, string packageId, string msisdn, string encryptionKey)
        {
            string encryptedUser = await EncryptFieldAsync(user, encryptionKey);
            string encryptedPassword = await EncryptFieldAsync(password, encryptionKey);
            string encryptedPackageId = await EncryptFieldAsync(packageId, encryptionKey);
            string encryptedMsisdn = await EncryptFieldAsync(msisdn, encryptionKey);

            return (encryptedUser, encryptedPassword, encryptedPackageId, encryptedMsisdn);
        }
    }
}

using GamesWay.Data;
using GamesWay.Infrastructure.Helpers;
using GamesWay.Models;
using GamesWay.ViewModels;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;

namespace GamesWay.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
		private readonly ApplicationDbContext _context;
		string gamePathencryptionKey = "DHDUFYlinsGDDSSs";
		public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
        {
            _logger = logger;
			_context = context;
        }
        [HttpPost]
        public IActionResult SetLanguage(string culture, string returnUrl)
        {
            Response.Cookies.Append(CookieRequestCultureProvider.DefaultCookieName, CookieRequestCultureProvider.MakeCookieValue
                (new RequestCulture(culture)), new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) });
            return LocalRedirect(returnUrl);
        }
        public IActionResult Index()
        {
			ViewBag.GamesCategory = new List<string> { "Arcade And Puzzle Games", "Board Games", "Logic Games", "Sport Games" };
			return View(ViewBag.GamesCategory);
        }
		public async Task<IActionResult> GetGamesList(string categoryName, int pageNo = 1, int pageSize = 12)
		{
			if (categoryName == null)
			{
				categoryName = "Sport Games";
			}
			try
			{
				if (HttpContext.Session != null)
				{
					string isSubscribed = HttpContext.Session.GetString("IsSubscribed");
                    //string sessionId = HttpContext.Session.GetString("SessionId");
                    string endSubscriptionDate = HttpContext.Session.GetString("EndOfSubscription");
                    string msisdn = HttpContext.Session.GetString("Msisdn");
                    var existingSession = await _context.LogSessions
                        .Where(x => x.Msisdn == msisdn)
                        .OrderByDescending(x => x.LoginTime)
                        .FirstOrDefaultAsync();

                    var gamesList = new List<GamesVM>();
					var gamesPath = Path.Combine("wwwroot", "Games", categoryName);
					var gameFolders = Directory.GetDirectories(gamesPath);
					var startIndex = (pageNo - 1) * pageSize;
					var endIndex = Math.Min(startIndex + pageSize, gameFolders.Length);
					for (int i = startIndex; i < endIndex && i < gameFolders.Length; i++)
					{
						var item = gameFolders[i];
						var gameFolder = Directory.GetDirectories(item).FirstOrDefault(folder =>
							Directory.GetFiles(Path.Combine(folder), "index.html").Any());

						var thumbPath = Path.Combine(item, "thumbs");
						if (!Directory.Exists(thumbPath))
						{
							thumbPath = Path.Combine(item, "screenshots");
						}
						if (!Directory.Exists(thumbPath))
						{
							thumbPath = null;
						}

						string thumbFileName = null;
						if (thumbPath != null)
						{
							var thumbFiles = Directory.GetFiles(thumbPath);
							thumbFileName = thumbFiles.FirstOrDefault() != null ? Path.GetFileName(thumbFiles[0]) : null;
						}
						string gamePath;
						string encryptedgamePath = string.Empty;
						DateTime.TryParse(endSubscriptionDate, out DateTime endOfSubscriptionDate);

                        if (msisdn != null)
                        {
                            if (isSubscribed == "true" || endOfSubscriptionDate > DateTime.Now || existingSession.IsActive == true)
                            {
                                gamePath = $"/{item.Substring(item.IndexOf("Games")).Replace("\\", "/")}/game/index.html";
                                encryptedgamePath = await EncryptionHelpers.EncryptFieldAsync(gamePath, gamePathencryptionKey);

                                //using (Aes aesAlg = Aes.Create())
                                //{
                                //	aesAlg.Key = Encoding.UTF8.GetBytes(gamePathencryptionKey);
                                //	aesAlg.Mode = CipherMode.CBC; // Set encryption mode to CBC
                                //	aesAlg.Padding = PaddingMode.PKCS7; // Set padding mode to PKCS7
                                //}
                            }
                        }
                        else
                        {
                            gamePath = Url.Action("Subscribe", "Subscribers");
                        }
						var gamesVM = new GamesVM
						{
							GameTitle = new DirectoryInfo(item).Name,
							GamePath = encryptedgamePath,
							Gamethumb = thumbFileName != null ? $"/Games/{categoryName}/{Path.GetFileName(item)}/{(thumbPath.EndsWith("thumbs") ? "thumbs" : "screenshots")}/{thumbFileName}" : null
						};
						gamesList.Add(gamesVM);
					}
                    ViewBag.GamesCategory = new List<string> { "Arcade And Puzzle Games", "Board Games", "Logic Games", "Sport Games" };
                    ViewBag.TotalPages = Math.Ceiling((double)gameFolders.Length / pageSize);
                    ViewBag.PageNo = pageNo;
                    return View(gamesList);
                }
				else
				{
                    var gamesList = new List<GamesVM>();
                    var gamesPath = Path.Combine("wwwroot", "Games", categoryName);
                    var gameFolders = Directory.GetDirectories(gamesPath);
                    var startIndex = (pageNo - 1) * pageSize;
                    var endIndex = Math.Min(startIndex + pageSize, gameFolders.Length);
                    for (int i = startIndex; i < endIndex && i < gameFolders.Length; i++)
                    {
                        var item = gameFolders[i];
                        var gameFolder = Directory.GetDirectories(item).FirstOrDefault(folder =>
                            Directory.GetFiles(Path.Combine(folder), "index.html").Any());

                        var thumbPath = Path.Combine(item, "thumbs");
                        if (!Directory.Exists(thumbPath))
                        {
                            thumbPath = Path.Combine(item, "screenshots");
                        }
                        if (!Directory.Exists(thumbPath))
                        {
                            thumbPath = null;
                        }

                        string thumbFileName = null;
                        if (thumbPath != null)
                        {
                            var thumbFiles = Directory.GetFiles(thumbPath);
                            thumbFileName = thumbFiles.FirstOrDefault() != null ? Path.GetFileName(thumbFiles[0]) : null;
                        }
                        var gamesVM = new GamesVM
                        {
                            GameTitle = new DirectoryInfo(item).Name,
                            GamePath = Url.Action("Subscribe", "Subscribers"),
                            Gamethumb = thumbFileName != null ? $"/Games/{categoryName}/{Path.GetFileName(item)}/{(thumbPath.EndsWith("thumbs") ? "thumbs" : "screenshots")}/{thumbFileName}" : null
                        };
                        gamesList.Add(gamesVM);
                    }
                    ViewBag.GamesCategory = new List<string> { "Arcade And Puzzle Games", "Board Games", "Logic Games", "Sport Games" };
                    ViewBag.TotalPages = Math.Ceiling((double)gameFolders.Length / pageSize);
                    ViewBag.PageNo = pageNo;
                    return View(gamesList);
                }
			}
			catch (DirectoryNotFoundException)
			{
				return View("Error", new ErrorViewModel
				{
					ErrorMessage = $"Category '{categoryName}' not found."
				});
			}
		}
        [HttpGet]
        public async Task<IActionResult> GamePage(string gamePath)
        {
			string decryptedGamePath = await EncryptionHelpers.DecryptAsync(gamePath, gamePathencryptionKey);
			ViewBag.GamePath = decryptedGamePath;
			return View();
        }
        public IActionResult AboutUs()
        {
            return View();
        }
        public IActionResult Terms()
        {
            return View();
        }
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
	}

}
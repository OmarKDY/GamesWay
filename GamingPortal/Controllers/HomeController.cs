using GamingPortal.Models;
using GamingPortal.ViewModels;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace GamingPortal.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
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
						GamePath = $"/{item.Substring(item.IndexOf("Games")).Replace("\\", "/")}/game/index.html",
						Gamethumb = thumbFileName != null ? $"/Games/{categoryName}/{Path.GetFileName(item)}/{(thumbPath.EndsWith("thumbs") ? "thumbs" : "screenshots")}/{thumbFileName}" : null
					};
					gamesList.Add(gamesVM);
				}
				ViewBag.GamesCategory = new List<string> { "Arcade And Puzzle Games", "Board Games", "Logic Games", "Sport Games" };
				ViewBag.TotalPages = Math.Ceiling((double)gameFolders.Length / pageSize);
				ViewBag.PageNo = pageNo;
				return View(gamesList);
			}
			catch (DirectoryNotFoundException)
			{
				return View("Error", new ErrorViewModel
				{
					ErrorMessage = $"Category '{categoryName}' not found."
				});
			}
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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using GamesWay.Data;
using GamesWay.Models;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using System.Text;

namespace GamesWay.Controllers
{
    public class DashboardController : Controller
    {
        private readonly ApplicationDbContext _context;
        private const string ExpectedMsisdn = "971567802545";
        private const string ExpectedPassword = "ErtibatSuperAdmin2468";

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Dashboard
        [HttpGet]
        public async Task<IActionResult> Index([FromQuery]DateOnly? selectedDate = null)
        {
            // Check if the user is authenticated
            if (HttpContext.Session.TryGetValue("Msisdn", out byte[] subscriberMsisdnBytes) && HttpContext.Session.TryGetValue("IsAuthenticated", out byte[] isAuthenticated))
            {
                string subscriberMsisdn = Encoding.UTF8.GetString(subscriberMsisdnBytes);
                bool dashboardAccess = BitConverter.ToBoolean(isAuthenticated, 0);
                if (dashboardAccess && subscriberMsisdn == "971567802545")
                {
                    // Default values for counters
                    int totalSubscribersCount = 0;
                    int renewalSubscribersCount = 0;
                    double UASR = 0;
                    int unsubscribedUsersCount = 0;
                    decimal totalPackageAmount = 0;
                    List<object> topRenewableSubscribers = new List<object>();

                    // Assuming Transactions represents the table containing transaction data
                    IQueryable<Transactions> transactionsQuery = _context.Transactions;
                    var allTransactions = await transactionsQuery.ToListAsync();
                    // Filter transactions by selected date if provided
                    if (selectedDate.HasValue)
                    {
                        // Parse the selected date outside of the LINQ query
                        var parsedDate = DateOnly.ParseExact(selectedDate.Value.ToString("M-d-yyyy"), "M-d-yyyy");

                        transactionsQuery = allTransactions
                            .Where(t => DateOnly.ParseExact(t.DateOfSubscription.Substring(0, 10), "yyyy-MM-dd") == parsedDate)
                            .AsQueryable();
                        // Fetch the UserAttmp data into memory
                        var userAttempts = await _context.UserAttmp.ToListAsync();

                        // Filter the user attempts for the selected date and success messages
                        int successfulAttemptsCountForDate = userAttempts
                            .Where(u => (u.responsemsg == "PIN SENT SUCCESSFUL" || u.responsemsg == "ALREADY SUB") &&
                                DateOnly.ParseExact(u.DateOfAttmp.Substring(0, 10), "yyyy-MM-dd") == parsedDate)
                            .Count();

                        // Filter the user attempts for the selected date
                        int totalAttemptsCountForDate = userAttempts
                            .Where(u => DateOnly.ParseExact(u.DateOfAttmp.Substring(0, 10), "yyyy-MM-dd") == parsedDate)
                            .Count();

                        // Calculate the success rate
                        UASR = totalAttemptsCountForDate > 0 ? (double)successfulAttemptsCountForDate / totalAttemptsCountForDate * 100 : 0;
                    }

                    if (UASR == 0)
                    {
                        var userAttempts = await _context.UserAttmp.ToListAsync();

                        int successfulAttemptsCount = userAttempts.Where(u => u.responsemsg == "PIN SENT SUCCESSFUL" || u.responsemsg == "ALREADY SUB")
                            .Count();

                        // Get the total count of rows in the UserAttmp table
                        int totalAttemptsCount = userAttempts.Count();

                        // Calculate the overall success rate percentage
                        UASR = totalAttemptsCount > 0 ? (double)successfulAttemptsCount / totalAttemptsCount * 100 : 0;
                    }

                    // Get distinct subscriber IDs from transactionsQuery
                    var distinctSubscriberIds = transactionsQuery
                        .Where(t => t.TransactionType == "SUB")
                        .Select(t => t.SubscriberId)
                        .Distinct()
                        .ToList();

                    // Count the subscribers that have transactions in transactionsQuery
                    totalSubscribersCount = await _context.Subscribers
                        .Where(s => distinctSubscriberIds.Contains(s.SubscriberId))
                        .CountAsync();

                    renewalSubscribersCount = transactionsQuery
                        .Where(t => t.TransactionType == "REN")
                        .Select(t => t.SubscriberId)
                        .Distinct()
                        .Count();

                    unsubscribedUsersCount = transactionsQuery
                        .Where(t => t.TransactionType == "UNSUB")
                        .Select(t => t.SubscriberId)
                        .Distinct()
                        .Count();

                    totalPackageAmount = transactionsQuery
                        .Where(t => t.PackageAmount != null)
                        .Sum(t => (decimal)t.PackageAmount);

                    totalPackageAmount /= 100;

                    // Get top renewable subscribers based on filtered transactions
                    //topRenewableSubscribers = await _context.Subscribers.Where(s => _context.Transactions.Any(t => t.SubscriberId == s.SubscriberId && t.TransactionType == "REN"))
                    //    .Select(s => new
                    //    {
                    //        Msisdn = s.Msisdn,
                    //        RenewalCount = s.Transactions.Count(t => t.TransactionType == "REN")
                    //    })
                    //    .OrderByDescending(s => s.RenewalCount)
                    //    .Take(10)
                    //    .ToListAsync<object>();

                    // Pass the data to the view
                    ViewBag.SubscribersCount = totalSubscribersCount;
                    ViewBag.IsSubscribedCount = renewalSubscribersCount;
                    ViewBag.UASR = UASR;
                    ViewBag.UnSubUsersCount = unsubscribedUsersCount;
                    ViewBag.TotalPackageAmount = totalPackageAmount;
                    //ViewBag.TopRenewableSubscribers = topRenewableSubscribers;

                    return View();
                }
            }
            return View("Login");
        }

        [HttpPost]
        public IActionResult Authenticate(string msisdn, string password)
        {
            // Check if the provided Msisdn and password match the expected values
            if (msisdn == ExpectedMsisdn && password == ExpectedPassword)
            {
                // Set a session variable to indicate that the user is authenticated
                HttpContext.Session.SetString("Msisdn", "971567802545");
                HttpContext.Session.SetString("IsAuthenticated", "true");
                // Redirect to the Dashboard page
                return RedirectToAction("Index");
            }
            else
            {
                // Redirect to the "Access Denied" screen
                return BadRequest("AccessDenied");
            }
        }

        //// GET: Dashboard/Details/5
        //public async Task<IActionResult> Details(string id)
        //{
        //    if (id == null || _context.Transactions == null)
        //    {
        //        return NotFound();
        //    }

        //    var transactions = await _context.Transactions
        //        .Include(t => t.Subscriber)
        //        .FirstOrDefaultAsync(m => m.TransactionId == id);
        //    if (transactions == null)
        //    {
        //        return NotFound();
        //    }

        //    return View(transactions);
        //}

        //// GET: Dashboard/Create
        //public IActionResult Create()
        //{
        //    ViewData["SubscriberId"] = new SelectList(_context.Subscribers, "SubscriberId", "SubscriberId");
        //    return View();
        //}

        //// POST: Dashboard/Create
        //// To protect from overposting attacks, enable the specific properties you want to bind to.
        //// For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> Create([Bind("TransactionId,TransactionId2,TransactionType,PackageAmount,DateOfSubscription,EndOfSubscription,Channel,SubscriberId")] Transactions transactions)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        _context.Add(transactions);
        //        await _context.SaveChangesAsync();
        //        return RedirectToAction(nameof(Index));
        //    }
        //    ViewData["SubscriberId"] = new SelectList(_context.Subscribers, "SubscriberId", "SubscriberId", transactions.SubscriberId);
        //    return View(transactions);
        //}

        //// GET: Dashboard/Edit/5
        //public async Task<IActionResult> Edit(string id)
        //{
        //    if (id == null || _context.Transactions == null)
        //    {
        //        return NotFound();
        //    }

        //    var transactions = await _context.Transactions.FindAsync(id);
        //    if (transactions == null)
        //    {
        //        return NotFound();
        //    }
        //    ViewData["SubscriberId"] = new SelectList(_context.Subscribers, "SubscriberId", "SubscriberId", transactions.SubscriberId);
        //    return View(transactions);
        //}

        //// POST: Dashboard/Edit/5
        //// To protect from overposting attacks, enable the specific properties you want to bind to.
        //// For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> Edit(string id, [Bind("TransactionId,TransactionId2,TransactionType,PackageAmount,DateOfSubscription,EndOfSubscription,Channel,SubscriberId")] Transactions transactions)
        //{
        //    if (id != transactions.TransactionId)
        //    {
        //        return NotFound();
        //    }

        //    if (ModelState.IsValid)
        //    {
        //        try
        //        {
        //            _context.Update(transactions);
        //            await _context.SaveChangesAsync();
        //        }
        //        catch (DbUpdateConcurrencyException)
        //        {
        //            if (!TransactionsExists(transactions.TransactionId))
        //            {
        //                return NotFound();
        //            }
        //            else
        //            {
        //                throw;
        //            }
        //        }
        //        return RedirectToAction(nameof(Index));
        //    }
        //    ViewData["SubscriberId"] = new SelectList(_context.Subscribers, "SubscriberId", "SubscriberId", transactions.SubscriberId);
        //    return View(transactions);
        //}

        //// GET: Dashboard/Delete/5
        //public async Task<IActionResult> Delete(string id)
        //{
        //    if (id == null || _context.Transactions == null)
        //    {
        //        return NotFound();
        //    }

        //    var transactions = await _context.Transactions
        //        .Include(t => t.Subscriber)
        //        .FirstOrDefaultAsync(m => m.TransactionId == id);
        //    if (transactions == null)
        //    {
        //        return NotFound();
        //    }

        //    return View(transactions);
        //}

        //// POST: Dashboard/Delete/5
        //[HttpPost, ActionName("Delete")]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> DeleteConfirmed(string id)
        //{
        //    if (_context.Transactions == null)
        //    {
        //        return Problem("Entity set 'ApplicationDbContext.Transactions'  is null.");
        //    }
        //    var transactions = await _context.Transactions.FindAsync(id);
        //    if (transactions != null)
        //    {
        //        _context.Transactions.Remove(transactions);
        //    }

        //    await _context.SaveChangesAsync();
        //    return RedirectToAction(nameof(Index));
        //}

        //private bool TransactionsExists(string id)
        //{
        //  return (_context.Transactions?.Any(e => e.TransactionId == id)).GetValueOrDefault();
        //}
    }
}

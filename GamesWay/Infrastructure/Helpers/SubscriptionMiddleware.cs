using GamesWay.Data;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace GamesWay.Infrastructure.Helpers
{
    public class SubscriptionMiddleware
    {
        private readonly RequestDelegate _next;

        public SubscriptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, ApplicationDbContext applicationContext)
        {
            if (context.Session.TryGetValue("IsSubscribed", out byte[] isSubscribedData) &&
                context.Session.TryGetValue("EndOfSubscription", out byte[] endOfSubscriptionData))
            {
                string msisdn = context.Session.GetString("Msisdn");
                //string sessionId = context.Session.GetString("SessionId");

                bool isSubscribed = BitConverter.ToBoolean(isSubscribedData, 0);
                string endOfSubscriptionString = Encoding.UTF8.GetString(endOfSubscriptionData);
                var existingSession = await applicationContext.LogSessions
                    .Where(x => x.Msisdn == msisdn)
                    .OrderByDescending(x => x.LoginTime)
                    .FirstOrDefaultAsync();
                if (!isSubscribed || !DateTime.TryParse(endOfSubscriptionString, out DateTime endOfSubscription) || endOfSubscription <= DateTime.Now/* || existingSession.IsActive == false || existingSession.SessionId.ToString() != sessionId*/)
                {
                    var subscriber = await applicationContext.Subscribers.FirstOrDefaultAsync(x => x.Msisdn == msisdn);
                    subscriber.IsSubscribed = false;
                    await applicationContext.SaveChangesAsync();
                    context.Session.Clear();
                    context.Response.StatusCode = 307; // 307 Temporary Redirect status code
                    context.Response.Headers["Location"] = "/Subscribers/Subscribe"; // Redirect URL
                    return;
                }
            }

            // Continue processing the request
            await _next(context);
        }
    }
}

// Custom authorization attribute
public class AuthorizeSubscriberAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        // Check if the user is authenticated (based on session or custom token)
        if (!context.HttpContext.Session.Keys.Contains("Msisdn"))
        {
            // Redirect to the login page
            context.Result = new RedirectToActionResult("Login", "Subscribers", null);
        }
    }
}
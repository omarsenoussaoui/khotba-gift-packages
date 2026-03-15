using DarElKhotba.Application.DTOs;
using DarElKhotba.Application.Interfaces;
using DarElKhotba.Application.Validators;
using Microsoft.AspNetCore.Mvc;

namespace DarElKhotba.API.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService) => _orderService = orderService;

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateOrderDto dto, IFormFile? paymentScreenshot)
    {
        var errors = CreateOrderValidator.Validate(dto);
        if (errors.Count > 0)
            return BadRequest(ApiResponse<object>.Fail(string.Join(" ", errors)));

        var order = await _orderService.CreateAsync(dto, paymentScreenshot);
        return Created($"/api/orders/{order.OrderNumber}", ApiResponse<OrderDto>.Ok(order));
    }

    [HttpGet("{orderNumber}")]
    public async Task<IActionResult> GetByOrderNumber(string orderNumber)
    {
        var order = await _orderService.GetByOrderNumberAsync(orderNumber);
        if (order is null)
            return NotFound(ApiResponse<OrderDto>.Fail("Order not found."));
        return Ok(ApiResponse<OrderDto>.Ok(order));
    }
}

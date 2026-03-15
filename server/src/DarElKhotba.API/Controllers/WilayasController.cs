using DarElKhotba.Application.DTOs;
using DarElKhotba.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DarElKhotba.API.Controllers;

[ApiController]
[Route("api/wilayas")]
public class WilayasController : ControllerBase
{
    private readonly IWilayaRepository _wilayaRepo;

    public WilayasController(IWilayaRepository wilayaRepo) => _wilayaRepo = wilayaRepo;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var wilayas = await _wilayaRepo.GetAllAsync();
        var dtos = wilayas.Select(w => new WilayaDto
        {
            Code = w.Code,
            NameFr = w.NameFr,
            NameAr = w.NameAr,
        });
        return Ok(ApiResponse<IEnumerable<WilayaDto>>.Ok(dtos));
    }
}

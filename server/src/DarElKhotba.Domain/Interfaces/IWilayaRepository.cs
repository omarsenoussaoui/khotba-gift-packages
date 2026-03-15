using DarElKhotba.Domain.Entities;

namespace DarElKhotba.Domain.Interfaces;

public interface IWilayaRepository
{
    Task<IEnumerable<Wilaya>> GetAllAsync();
}

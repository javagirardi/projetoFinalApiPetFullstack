import { ROLE } from "@lab365/contracts";

export function criarRepositorioAuth(dataSource) {
  async function buscar(entidade, email, role) {
    const qb = dataSource.getRepository(entidade).createQueryBuilder("conta")
      .addSelect("conta.senha_hash").where("conta.email = :email", { email });
    if (role === ROLE.EQUIPE) qb.andWhere("conta.ativo = true");
    const conta = await qb.getOne();
    return conta ? { ...conta, role } : null;
  }
  return {
    async buscarPorEmail(email) {
      const [equipe, lar] = await Promise.all([
        buscar("Usuario", email, ROLE.EQUIPE), buscar("LarAdotivo", email, ROLE.LAR),
      ]);
      // Uma duplicidade entre tabelas não pode escolher uma identidade por acaso.
      if (equipe && lar) return null;
      return equipe || lar;
    },
  };
}

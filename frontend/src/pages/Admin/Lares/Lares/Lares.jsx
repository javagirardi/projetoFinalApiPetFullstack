import styles from './Lares.module.css'

// TODO: tela a implementar.
// Lares adotivos com o dossiê completo de cada um, um por linha: GET /lares-adotivos
// (cada lar já vem com a ficha, os pets sob guarda e os pedidos com histórico).
// Busca por nome, e-mail ou cidade. O histórico (só leitura) abre e fecha dentro do card.
// Em /admin/lares/:id (useParams), role até esse lar e deixe o histórico dele aberto.
export default function Lares() {
  return (
    <section className={styles.container}>
      <h1>Lares adotivos</h1>
      <p>Tela a implementar.</p>
    </section>
  )
}

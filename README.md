The spatial iterated Prisoner's Dilemma (often called the Nowak-May model) describes how cooperation can survive among selfish individuals through local interaction. The core rules are straightforward: agents are fixed on a grid, play with neighbors, and copy the most successful local strategy.

### The Setup
*   **The Grid**: Players are placed on a 2D square lattice, typically with periodic boundaries (edges wrap around).
*   **The Strategies**: Players use a **"pure" strategy**: they are either **always a Cooperator (C)** or **always a Defector (D)**. They do **not** remember past moves or anticipate future ones.

### The Game & Payoffs
*   **Neighborhood**: Each player interacts with their **8 immediate neighbors** (Moore neighborhood).
*   **Accumulated Payoff**: Players sum the payoffs from all 8 interactions. Standard payoffs are: Temptation (\(T\)), Reward (\(R\)), Punishment (\(P\)), and Sucker (\(S\)), with **\(T > R > P > S\)**.
*   **Common Parameterization**: A simplified version sets \(R=1\), \(P=S=0\), and treats **\(T=b\) (temptation to defect)** as the key parameter.

### The Update Rule
*   **Imitation of the Best**: In each generation, a player compares their total payoff with their neighbors'. They **imitate the strategy of the neighbor with the highest payoff** (including themselves).
*   **Synchronous Update**: All players update their strategies **at the same time** based on the current generation's payoffs.

### Key Outcomes
*   **Sustained Cooperation**: Unlike well-mixed populations, the spatial structure allows C and D to coexist indefinitely without complex strategies.
*   **Magic Agreement**: For certain temptation values (e.g., \(b \approx 1.85\)), cooperation often stabilizes around **31.8%** of the population.
*   **Chaotic Patterns**: Depending on the parameters and initial conditions, the grid can settle into stable clusters or chaotic, ever-shifting territorial invasions.
